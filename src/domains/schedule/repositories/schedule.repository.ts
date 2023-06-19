import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';
import { SchedulesType } from '../helper/constants';

@CustomRepository(Schedule)
export class ScheduleRepository extends Repository<Schedule> {
  async findAndCountByUserIdx(
    userIdx: number,
    pageRequest: PageRequest,
  ): Promise<[Schedule[], number]> {
    return await this.createQueryBuilder('schedule')
      .where('schedule.userIdx = :userIdx', { userIdx })
      .andWhere('schedule.type = :type', { type: SchedulesType.REPETITION })
      .orderBy('schedule.idx', pageRequest.order)
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }

  async findSchedulesByDate(userIdx: number, yearAndMonth: string) {
    return await this.createQueryBuilder('schedule')
      .where('schedule.userIdx = :userIdx', { userIdx })
      .andWhere('schedule.date LIKE :date', { date: `${yearAndMonth}%` })
      .orderBy('schedule.idx', 'ASC')
      .getMany();
  }

  async findByScheduleIdx(scheduleIdx: number): Promise<Schedule> {
    return await this.findOne({
      where: {
        idx: scheduleIdx,
      },
    });
  }

  async findSchedulesByTime(time: string) {
    return await this.createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.user', 'user')
      .where('schedule.alarmTime = :time', { time })
      .getMany();
  }
}
