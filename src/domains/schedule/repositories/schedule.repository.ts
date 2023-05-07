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
    return this.createQueryBuilder('schedule')
      .where('schedule.userIdx = :userIdx', { userIdx })
      .orderBy('schedule.idx', 'DESC')
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }

  async findByScheduleIdx(scheduleIdx: number): Promise<Schedule> {
    return this.findOne({
      where: {
        idx: scheduleIdx,
      },
    });
  }
}
