import { Injectable } from '@nestjs/common';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import { EntityRepository, Repository } from "typeorm";
import { Iot_board_personal } from '../entities/iot_board_personal.entity';



@CustomRepository(Iot_board_personal)
export class IotBoardPersonalRepository extends Repository<Iot_board_personal> {
    findAndCountByUidIdx(
        userIdx: number,
        pageRequest: PageRequest,
      ): Promise<[Iot_board_personal[], number]> {
        return this.createQueryBuilder('iot_board_personal')
          .leftJoinAndSelect('iot_board_personal.pet', 'pet') // 어떤 테이블과 연결
          .where({ userIdx: userIdx })
          .orderBy('idx', 'DESC')
          .take(pageRequest.limit)
          .skip(pageRequest.offset)
          .getManyAndCount();
      }
}