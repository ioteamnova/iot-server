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

  // async getAccessToken() {
  //   return new Promise(function(resolve, reject) {
  //     const jwtClient = new google.auth.JWT(
  //       serviceAccount.client_email,
  //       null,
  //       serviceAccount.private_key.replace(/\\n/gm, '\n'),
  //       ['https://www.googleapis.com/auth/cloud-platform'],
  //       null
  //     );
  //     jwtClient.authorize(function(err, tokens) {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }
  //       resolve(tokens.access_token);
  //     });
  //   });
  // }

  // 스케줄 테이블에서 현재시간과 일치하는 row 찾기
  async getSchdeule(token: string) {
    const user = await this.userRepository.findOne({
      where: {
        fbToken: token,
      },
    });
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    const currentTime = DateUtils.momentTime();

    const time = DateUtils.stringToTime(currentTime);

    let testTime;
    testTime = '18:00'; // 테스트용
    testTime = DateUtils.stringToTime(testTime);

    const day = DateUtils.momentDay();
    console.log('day::', day);

    // todo: getMany로 여러개 가져와야함. 같은 유저가 같은 시간의 스케줄을 등록했을 경우 대비
    const schedule = await this.scheduleRepository.findOne({
      where: {
        userIdx: user.idx,
        alarmTime: testTime,
      },
    });
    console.log('schedule::', schedule);

    // 스케줄 없으면? 빈값 리턴시켜도 되는지?
    const repeat = schedule.repeat;
    // 스트링 => 어레이
    const repeatArray = repeat.split(',');
    console.log('repeatArray::', repeatArray);

    let isRepeat: boolean;
    // day가 0~6까지 나오고, 배열의 인덱스도 0~6 이다. 해당 요일의 값이 1인지 0인지 체크
    if (repeatArray[day] === '1') {
      isRepeat = true;
    }

    if (!isRepeat) {
      console.log('isRepeat::', isRepeat);
      console.log('알람 설정한 요일이 아님.');
    }
    return schedule;
  }

  // @Cron(CronExpression.EVERY_MINUTE) // 1분마다 실행
  async sendPushMessage(token: string) {
    // 1. 1분마다 스케줄 db에서 현재시간과 일치하는것을 찾는다.
    const schedule = await this.getSchdeule(token);
    if (!schedule) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_SCHEDULE);
    }
    // 2. 있으면 파이어베이스로 title-body를 담아서 전송
    const title = schedule.title;
    const body = schedule.memo;

    await this.sendNotification(title, body, token);
  }

  async sendNotification(title: string, body: string, token: string) {
    const message = {
      android: {
        data: {
          title: title,
          body: body,
        },
      },
      apns: {
        payload: {
          aps: {
            contentAvailble: true,
            alert: {
              title: title,
              body: body,
            },
          },
        },
      },
      token: token,
    };
    // 푸시 알림 보내기
    admin
      .messaging()
      .send(message) //여러개: sendMulticast()
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }
}
