import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';

@CustomRepository(Schedule)
export class ScheduleRepository extends Repository<Schedule> {
  async findAndCountByUserIdx(
    userIdx: number,
    pageRequest: PageRequest,
  ): Promise<[Schedule[], number]> {
    return await this.createQueryBuilder('schedule')
      .where('schedule.userIdx = :userIdx', { userIdx })
      .orderBy('schedule.idx', pageRequest.order)
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }

  async findByScheduleIdx(scheduleIdx: number): Promise<Schedule> {
    return await this.findOne({
      where: {
        idx: scheduleIdx,
      },
    });
  }

  // async findCurrentSchedules(userIdxes: number[], time: Date) {
  //   return await this.createQueryBuilder('schedule')
  //     .where('schedule.userIdx IN (:...userIdxes)', { userIdxes })
  //     .andWhere('schedule.alarmTime', { time })
  //     .getMany();
  // }

  async findSchedulesByTime(time: string) {
    return await this.createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.user', 'user')
      .where('schedule.alarmTime = :time', { time })
      .getMany();
  }
}
