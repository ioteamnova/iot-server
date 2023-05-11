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
import moment from 'moment-timezone';
import { google } from 'googleapis';
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

    // const currentTime = moment().tz('Asia/Seoul').format('HH:mm:ss');
    const currentTime = '18:00:00'; // 테스트용
    console.log('currentTime::', currentTime);

    const time = new Date(currentTime);
    console.log('time::', time);

    // todo: getMany로 여러개 가져와야함. 같은 유저가 같은 시간의 스케줄을 등록했을 경우 대비
    const schedule = await this.scheduleRepository.findOne({
      where: {
        userIdx: user.idx,
        alarmTime: time,
      },
    });
    console.log('schedule::', schedule);

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
    const userIdx = schedule.userIdx;
    const repeat = schedule.repeat; //todo: 스트링이니까 배열로 변환해서 (또는 Json?) 배열에서 1인 인덱스 위치와 현재 요일이 1이면
    console.log('type::', typeof repeat);

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

  // async sendNotification() {
  //   const message = {
  //     android: {
  //       data: {
  //         title: 'title',
  //         body: 'body',
  //       },
  //     },
  //     apns: {
  //       payload: {
  //         aps: {
  //           contentAvailble: true,
  //           alert: {
  //             title: 'title',
  //             body: 'body',
  //           },
  //         },
  //       },
  //     },
  //     token: 'token',
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
