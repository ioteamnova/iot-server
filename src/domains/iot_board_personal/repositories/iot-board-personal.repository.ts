import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import { Repository } from 'typeorm';
import { IotBoardPersonal } from '../entities/iot-board-personal.entity';

@CustomRepository(IotBoardPersonal)
export class IotBoardPersonalRepository extends Repository<IotBoardPersonal> {
  findAndCountByUserIdx(
    userIdx: number,
    pageRequest: PageRequest,
  ): Promise<[IotBoardPersonal[], number]> {
    return this.createQueryBuilder('iot_board_personal')
      .where({ userIdx: userIdx })
      .orderBy('idx', 'DESC')
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }
}
