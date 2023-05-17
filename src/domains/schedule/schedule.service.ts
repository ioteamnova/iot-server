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

// import serviceAccount from '../../../firebase-adminsdk.json';

@Injectable()
export class ScheduleService {
  private fcm: admin.messaging.Messaging;

  constructor(
    private scheduleRepository: ScheduleRepository,
    private userRepository: UserRepository,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require('../../../firebase-adminsdk.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    this.fcm = admin.messaging();
  }
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

  async remove(scheduleIdx: number) {
    const schedule = await this.scheduleRepository.findByScheduleIdx(
      scheduleIdx,
    );
    if (!schedule) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_SCHEDULE);
    }

    await this.scheduleRepository.softDelete(scheduleIdx);
  }

  // @Cron(CronExpression.EVERY_MINUTE) // 1분마다 실행
  async sendPushMessages() {
    // 1. 현재시간의 스케줄 가져오기
    const currentTime = DateUtils.momentTime(); // 현재 시간 '18:00'
    const testTime = '18:00'; // 테스트용
    const day = DateUtils.momentDay(); // 현재 요일 3

    const schedules = await this.scheduleRepository.findSchedulesByTime(
      testTime,
    );
    if (!schedules) {
      console.log('No schedules to send alerts.');
      return;
    }

    const matchingSchedules = schedules.filter((schedule) => {
      const repeatArray = schedule.repeat.split(',');
      const isRepeat: boolean = repeatArray[day] === '1';

      return isRepeat;
    });

    if (!matchingSchedules) {
      console.log('No schedules to send alerts.');
      return;
    }

    // 유저 토큰 가져오기
    const userTokens = matchingSchedules.map((ms) => ms.user.fbToken);

    for (const matchingSchedule of matchingSchedules) {
      const title = matchingSchedule.title;
      const body = matchingSchedule.memo;

      console.log(
        `${DateUtils.momentNow()} || The matchingSchedule of idx is : ${
          matchingSchedule.idx
        }.`,
      );
      await this.sendNotifications(title, body, userTokens);
    }
  }

  // 파이어베이스 서버로 요청 보내는 함수
  async sendNotifications(title: string, body: string, tokens: string[]) {
    const message = {
      notification: {
        title: title,
        body: body,
        imageUrl:
          'https://reptimate.s3.ap-northeast-2.amazonaws.com/reptimate_logo.png',
      },
      tokens: tokens,
      android: {
        // data안에 클라이언트에게 보낼 필요할 데이터 입력
        data: {},
      },
      apns: {
        payload: {
          // aps안에 클라이언트에게 보낼 필요할 데이터 입력
          aps: {},
        },
      },
    };

    try {
      const responses = await this.fcm.sendEachForMulticast(message);
      console.log('Successfully sent messages:', responses);
    } catch (error) {
      console.log('Error sending messages:', error);
    }
  }
}
