import { Schedule } from './entities/schedule.entity';
import { ScheduleRepository } from './repositories/schedule.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import { UpdateScheduleDto } from './dtos/update-schedule.dto';
import { Page, PageRequest } from 'src/core/page';
import { UserRepository } from '../user/repositories/user.repository';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { ScheduleListDto } from './dtos/schedule-list.dto';
import * as admin from 'firebase-admin';
import { Cron, CronExpression } from '@nestjs/schedule';
import DateUtils from 'src/utils/date-utils';
import { SchedulesType } from './helper/constants';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../../../firebase-adminsdk.json');

@Injectable()
export class ScheduleService {
  private fcm: admin.messaging.Messaging;

  constructor(
    private scheduleRepository: ScheduleRepository,
    private userRepository: UserRepository,
  ) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    this.fcm = admin.messaging();
  }
  /**
   * 스캐줄 생성
   * @param dto
   * @param userIdx
   * @returns 생성된 스케줄
   */
  async create(dto: CreateScheduleDto, userIdx: number) {
    const user = await this.userRepository.findByUserIdx(userIdx);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    const schedule = Schedule.from(dto);
    schedule.userIdx = userIdx;

    const result = await this.scheduleRepository.save(schedule);
    return result;
  }

  /**
   * 스케줄 목록 조회 (반복 알림 스케줄링 조회)
   * @param userIdx
   * @param pageRequest
   * @returns 타입이 반복인 스케줄 목록
   */
  async findAll(
    userIdx: number,
    pageRequest: PageRequest,
  ): Promise<Page<ScheduleListDto>> {
    const user = await this.userRepository.findByUserIdx(userIdx);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    const [schedules, totalCount] =
      await this.scheduleRepository.findAndCountByUserIdx(userIdx, pageRequest);
    const items = schedules.map((schedule) => new ScheduleListDto(schedule));
    return new Page<ScheduleListDto>(totalCount, items, pageRequest);
  }

  /**
   * 해당날짜의 스케줄 목록 조회 (캘린더 스케줄링 조회)
   * @param userIdx
   * @param date
   * @param pageRequest
   * @returns 타입이 캘린더인 스케줄 목록
   */
  async findScheduleByDate(
    userIdx: number,
    date: string,
    pageRequest: PageRequest,
  ): Promise<Page<ScheduleListDto>> {
    const user = await this.userRepository.findByUserIdx(userIdx);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    const [schedules, totalCount] =
      await this.scheduleRepository.findAndCountByUserIdxAndDate(
        userIdx,
        date,
        pageRequest,
      );
    const items = schedules.map((schedule) => new ScheduleListDto(schedule));
    return new Page<ScheduleListDto>(totalCount, items, pageRequest);
  }

  /**
   * 스케줄링 수정
   * @param scheduleIdx
   * @param dto
   * @returns 수정된 스케줄
   */
  async update(scheduleIdx: number, dto: UpdateScheduleDto) {
    const schedule = await this.scheduleRepository.findByScheduleIdx(
      scheduleIdx,
    );
    if (!schedule) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_SCHEDULE);
    }
    schedule.updateFromDto(dto);
    const result = await this.scheduleRepository.save(schedule);
    return result;
  }

  /**
   * 스케줄 삭제
   * @param scheduleIdx
   */
  async remove(scheduleIdx: number) {
    const schedule = await this.scheduleRepository.findByScheduleIdx(
      scheduleIdx,
    );
    if (!schedule) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_SCHEDULE);
    }

    await this.scheduleRepository.softDelete(scheduleIdx);
  }

  /** 1분마다 사용자의 스케줄을 체크하는 기능.
   * 현재 시간과 일치하는 스케줄들을 가져와서 타입을 체크한다.
    타입이 캘린더면 날짜와 시간을 체크
    타입이 반복이면 시간과 요일을 체크
   */
  // @Cron(CronExpression.EVERY_MINUTE)
  async checkSchedules() {
    const currentTime = DateUtils.momentTime();
    // const testTime = '19:00'; // 테스트용
    const currentDay = DateUtils.momentDay();
    const currentDate = DateUtils.momentNowSubtractTime();

    const schedules = await this.scheduleRepository.findSchedulesByTime(
      currentTime,
    );
    if (schedules.length === 0) {
      console.log('No schedules to send alerts.');
      return;
    }

    const matchingSchedules = schedules.filter((schedule) => {
      if (
        schedule.type === SchedulesType.CALENDAR &&
        schedule.date === currentDate
      ) {
        return true;
      }

      if (schedule.type === SchedulesType.REPETITION) {
        const repeatArray = schedule.repeatDay.split(',');
        const sameDay: boolean = repeatArray[currentDay] === '1';
        return sameDay;
      }
    });

    if (matchingSchedules.length === 0) {
      console.log('No matchingSchedules to send alerts.');
      return;
    }
    /**
     * 유저의 토큰과 스케줄을 Map에 담는다.
     * 같은 유저(같은 토큰값)가 여러개의 스케줄을 갖고 있는 경우를 고려하여 Map을 사용.
     * */

    const userTokensMap = new Map();
    for (const matchingSchedule of matchingSchedules) {
      const userToken = matchingSchedule.user.fbToken;

      if (!userTokensMap.has(userToken)) {
        userTokensMap.set(userToken, []);
      }

      userTokensMap.get(userToken).push(matchingSchedule);
    }

    for (const [userToken, userSchedules] of userTokensMap) {
      const notifications = userSchedules.map((schedule) => {
        return {
          title: schedule.title,
          body: schedule.memo,
        };
      });

      await this.sendNotifications(notifications, userToken);
    }
  }

  /**
   * FCM 서버로 유저의 토큰과 발송할 메세지를 전송
   * @param notifications 사용자가 입력한 스케줄 제목, 내용
   * @param token 사용자 디바이스 FCM 토큰
   */
  async sendNotifications(notifications, token) {
    try {
      const responses = await Promise.all(
        notifications.map(async (notification) => {
          const message = {
            notification: {
              title: notification.title,
              body: notification.body,
            },
            tokens: [token],
            android: {
              data: {},
            },
            apns: {
              payload: {
                aps: {},
              },
            },
          };
          return this.fcm.sendEachForMulticast(message);
        }),
      );
      console.log('Successfully sent messages:', responses);
    } catch (error) {
      console.log('Error sending messages:', error);
    }
  }
}
