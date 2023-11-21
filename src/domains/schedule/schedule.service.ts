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
import { DataSource } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../../../firebase-adminsdk.json');

interface AlarmBody {
  type: string;
  description: string;
}

@Injectable()
export class ScheduleService {
  private fcm: admin.messaging.Messaging;

  constructor(
    private scheduleRepository: ScheduleRepository,
    private userRepository: UserRepository,
    private dataSource: DataSource,
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
  async findRepeatSchedules(
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
   * 해당 월의 달력 스케줄 목록 조회 (캘린더 스케줄링 조회)
   * @param userIdx
   * @param date
   * @returns 해당 월의 타입이 캘린더인 스케줄
   */
  async findScheduleByDate(userIdx: number, date: string) {
    const user = await this.userRepository.findByUserIdx(userIdx);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }
    const yearAndMonth = date.substring(0, 7);
    const schedules = await this.scheduleRepository.findSchedulesByDate(
      userIdx,
      yearAndMonth,
    );
    return schedules;
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

  @Cron(CronExpression.EVERY_MINUTE)
  async checkSchedules() {
    const currentTime = DateUtils.momentTime();
    const testTime = '16:00'; // 테스트용 시간
    const currentDay = DateUtils.momentDay();
    const testDate = '2023-08-25'; // 테스트용 날짜
    const currentDate = DateUtils.momentNowSubtractTime();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const getDataQuery = `
      SELECT * FROM schedule S
      LEFT JOIN fb_token F
      ON S.user_idx = F.user_idx where S.alarm_time = ?
      `;
      //조회 데이터
      const schedules = await queryRunner.query(getDataQuery, [
        currentTime,
        // testTime
      ]);

      // console.log(schedules)

      if (schedules.length === 0) {
        console.log('No schedules to send alerts.');
        return;
      }

      const matchingSchedules = schedules.filter((schedule) => {
        if (
          schedule.type === SchedulesType.CALENDAR &&
          schedule.date === currentDate
          // schedule.date === testDate
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
        const userToken = matchingSchedule.fb_token;

        if (!userTokensMap.has(userToken)) {
          userTokensMap.set(userToken, []);
        }

        userTokensMap.get(userToken).push(matchingSchedule);
      }

      for (const [userToken, userSchedules] of userTokensMap) {
        const notifications = userSchedules.map((schedule) => {
          
          return {
            title: schedule.type,
            body: schedule.title,
          };
        });

        await this.sendNotifications(notifications, userToken);

      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * FCM 서버로 유저의 토큰과 발송할 메세지를 전송
   * @param notifications 사용자가 입력한 스케줄 제목, 내용
   * @param token 사용자 디바이스 FCM 토큰
   */
  async sendNotifications(notifications, tokens) {

    const message = {
        data: {
          title: notifications.title,
          body: notifications.body,
        },
      tokens: [tokens],
    };
    
    this.fcm.sendMulticast(message)
      .then((response) => {

        if (response.failureCount > 0) {
          const failedTokens = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              failedTokens.push(tokens[idx]);
            }
          });
          console.log('List of tokens that caused failures: ' + failedTokens);
        } else{
          console.log(`else - Successfully sent messages(response):`+response);
          console.log(`else - Successfully sent messages(responses0):`+response.responses);
          console.log(`else - Successfully sent messages(successCount):`+response.successCount);
        }

        console.log(`Successfully sent messages(response):`+response);
        console.log(`Successfully sent messages(responses0):`+response.responses);
        console.log(`Successfully sent messages(successCount):`+response.successCount);

      });

    // try {

    //   const responses = await Promise.all(
    //     notifications.map(async (notification) => {
    //       const message
    //       = {
    //         // notification: {
    //         //   title: notification.title,
    //         //   body: notification.body,
    //         // },
    //         data: {
    //           title: notification.title,
    //           body: notification.body,
    //         },
    //         tokens: [tokens],
    //         // tokens: [token],
    //         // android: {
    //         //   data: {},
    //         // },
    //         // apns: {
    //         //   payload: {
    //         //     aps: {},
    //         //   },
    //         // },
    //       };
    //       return this.fcm.sendEachForMulticast(message);
    //       // return this.fcm.send(message);

    //     }),
    //   );
    //   console.log('Successfully sent messages:', responses);
    // } catch (error) {
    //   console.log('Error sending messages:', error);
    // }
  }
}
