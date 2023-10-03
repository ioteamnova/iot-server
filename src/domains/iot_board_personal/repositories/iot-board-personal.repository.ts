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
      .leftJoinAndSelect('iot_board_personal.iotAuthInfo', 'iot-auth-info')
      .where({ userIdx: userIdx })
      .orderBy('iot_board_personal.idx', pageRequest.order)
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }
}
