import { Injectable } from '@nestjs/common';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import { EntityRepository, Repository } from "typeorm";
import { iot_nature_record } from '../entities/iot_nature_record.entity';



@CustomRepository(iot_nature_record)
export class IotNaturerecordRepository extends Repository<iot_nature_record> {
    // findAndCountByUidIdx(
    //     //userIdx: number,
    //     pageRequest: PageRequest,
    //     boardIdx: number,
    //     date: Date,
    //   ): Promise<[iot_naturerecord[], number]> {
    //     return this.createQueryBuilder('iot_nature_record')
    //       //.where({ boardIdx: boardIdx, createdAt: date,})
    //       .where({ boardIdx: boardIdx})
    //       .andWhere({createdAt: date})
          
    //       //.orderBy('diary.idx', 'DESC')
    //       .take(pageRequest.limit)
    //       .skip(pageRequest.offset)
    //       .getManyAndCount();
    //   }
}