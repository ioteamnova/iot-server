import { Injectable } from '@nestjs/common';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import { EntityRepository, Repository } from "typeorm";
import { IotBoardPersonal } from '../entities/iot-board-personal.entity';



@CustomRepository(IotBoardPersonal)
export class IotBoardPersonalRepository extends Repository<IotBoardPersonal> {
      findAndCountByUserIdx(
        userIdx: number,
        pageRequest: PageRequest,
      ): Promise<[IotBoardPersonal[], number]> {
        return this.createQueryBuilder('iot_board_personal')
          .leftJoinAndSelect('iot_board_personal.pet', 'pet') // 어떤 테이블과 연결
          .where({ userIdx: userIdx })
          .orderBy('idx', 'DESC')
          .take(pageRequest.limit)
          .skip(pageRequest.offset)
          .getManyAndCount();
      }
}