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
// import serviceAccount from '../../../firebase-adminsdk.json';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import * as moment from 'moment-timezone';
import { google } from 'googleapis';
import DateUtils from 'src/utils/date-utils';
import { MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../../../firebase-adminsdk.json');

@Injectable()
export class ScheduleService {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private userRepository: UserRepository,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
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

  // 스케줄 테이블에서 현재시간과 일치하는 row 찾기
  async getSchdeules(tokens: string[]) {
    // 토큰으로 유저 여러명을 가져옴
    const users = await this.userRepository.findByfbTokens(tokens);
    if (!users) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    // todo: +9시간해야함.
    const currentTime = DateUtils.stringToTime(DateUtils.momentTime());
    console.log('currentTime::', currentTime);
    console.log('currentTime type::', typeof currentTime);
    const testTime = DateUtils.stringToTime('18:00'); // 테스트용

    const day = DateUtils.momentDay();

    const userIdxes = users.map((user) => user.idx);
    const schedules = await this.scheduleRepository.findCurrentSchedules(
      userIdxes,
      testTime,
    );
    if (!schedules) return;

    const matchingSchedules = schedules.filter((schedule) => {
      const repeatArray = schedule.repeat.split(',');
      console.log('repeatArray::', repeatArray);
      const isRepeat: boolean = repeatArray[day] === '1';

      return isRepeat;
    });

    if (!matchingSchedules) {
      console.log('No alarm scheduled for today.');
      return;
    }

    return matchingSchedules;
  }

  async getSingleSchdeule(token: string) {
    const user = await this.userRepository.findOne({
      where: {
        fbToken: token,
      },
    });
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    const testTime = DateUtils.stringToTime('18:00'); //  for test, convert string '18:00' to 18:00 Date

    const day = DateUtils.momentDay(); // get day number from moment.js

    const schedule = await this.scheduleRepository.findOne({
      where: {
        userIdx: user.idx,
        alarmTime: testTime,
      },
    });
    if (!schedule) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_SCHEDULE);
    }

    const repeat = schedule.repeat; // ex) 1,1,1,1,1,1,1
    const repeatArray = repeat.split(',');

    let isRepeat: boolean;
    // day가 0~6까지 나오고, 배열의 인덱스도 0~6 이다. 해당 요일의 값이 1인지 0인지 체크
    if (repeatArray[day] === '1') {
      isRepeat = true;
    }

    if (!isRepeat) {
      console.log('Today is no alarm.');
      return;
    }
    return schedule;
  }

  // @Cron(CronExpression.EVERY_MINUTE) // 1분마다 실행
  async sendPushMessage(tokens: string[]) {
    const schedules = await this.getSchdeules(tokens);
    for (const schedule of schedules) {
      const title = schedule.title;
      const body = schedule.memo;

      console.log(
        `${DateUtils.momentNow()} || The schedule of idx is : ${schedule.idx}.`,
      );
      await this.sendNotification(title, body, tokens);
    }
  }

  // 복수 메세지 처리
  async sendNotification(title: string, body: string, tokens: string[]) {
    // todo: refactoring
    const messages = tokens.map((token) => ({
      notification: {
        title: title,
        body: body,
        imageUrl:
          'https://reptimate.s3.ap-northeast-2.amazonaws.com/reptimate_logo.png',
      },
      token: token,
      android: {
        // data를 사용하면 내용을 자유롭게 입력 가능
        data: {
          idx: '3',
        },
      },
      apns: {
        payload: {
          aps: {
            // aps안에 custom data 자유롭게 사용 가능
            idx: '3',
          },
        },
      },
    }));
    // 푸시 알림 보내기
    const sendPromises = messages.map((message) =>
      admin.messaging().send(message),
    );

    try {
      const responses = await Promise.all(sendPromises);
      console.log('Successfully sent messages:', responses);
    } catch (error) {
      console.log('Error sending messages:', error);
    }
  }

  // 단일 메세지 처리
  // async sendNotification(title: string, body: string, tokens: string[]) {
  //   const message = {
  //     notification: {
  //       title: title,
  //       body: body,
  //       imageUrl:
  //         'https://reptimate.s3.ap-northeast-2.amazonaws.com/reptimate_logo.png',
  //     },
  //     token: token,
  //     android: {
  //       // data를 사용하면 내용을 자유롭게 입력 가능
  //       data: {
  //         idx: '3',
  //       },
  //     },
  //     apns: {
  //       payload: {
  //         aps: {
  //           // aps안에 custom data 자유롭게 사용 가능
  //           idx: '3',
  //         },
  //       },
  //     },
  //   };
  //   // 푸시 알림 보내기
  //   admin
  //     .messaging()
  //     .send(message) //여러개: sendMulticast()
  //     .then((response) => {
  //       console.log('Successfully sent message:', response);
  //     })
  //     .catch((error) => {
  //       console.log('Error sending message:', error);
  //     });
  // }
}
