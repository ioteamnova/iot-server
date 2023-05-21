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
const serviceAccount = require('../../../firebase-adminsdk.json');

@Injectable()
export class ScheduleService {
  private fcm: admin.messaging.Messaging;

  constructor(
    private scheduleRepository: ScheduleRepository,
    private userRepository: UserRepository,
  ) {
    // const serviceAccount: ServiceAccount = {
    //   projectId: process.env.FB_PROJECT_ID,
    //   clientEmail: process.env.FB_CLIENT_EMAIL,
    //   privateKey: process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
    // };
    // console.log(serviceAccount);
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

  @Cron(CronExpression.EVERY_MINUTE)
  async sendPushMessages() {
    const currentTime = DateUtils.momentTime();
    console.log('currentTime::', currentTime);
    const testTime = '18:00'; // 테스트용
    const day = DateUtils.momentDay();

    const schedules = await this.scheduleRepository.findSchedulesByTime(
      testTime,
    );
    if (schedules.length === 0) {
      console.log('No schedules to send alerts.');
      return;
    }

    const matchingSchedules = schedules.filter((schedule) => {
      const repeatArray = schedule.repeat.split(',');
      const isRepeat: boolean = repeatArray[day] === '1';
      return isRepeat;
    });

    if (matchingSchedules.length === 0) {
      console.log('No matchingSchedules to send alerts.');
      return;
    }
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

      console.log(
        `${DateUtils.momentNow()} || Sending notifications to user: ${userSchedules}`,
      );
      await this.sendNotifications(notifications, userToken);
    }
  }

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
