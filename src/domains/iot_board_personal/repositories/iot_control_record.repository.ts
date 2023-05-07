import { Injectable } from '@nestjs/common';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { EntityRepository, Repository } from "typeorm";
import { iot_control_record } from '../entities/iot_control_record.entity';



@CustomRepository(iot_control_record)
export class IotControlrecordRepository extends Repository<iot_control_record> {
    // async createBoard(createBoardDto : CreateBoardDto) : Promise<Iot_personal> {
    //     const {title, description} = createBoardDto;
    //     const board = this.create({
    //         title,
    //         description,
    //         status : BoardStatus.PUBLIC
    //     })

    //     await this.save(board); // db에 만들어진 객체를 저장
    //     return board
    // }
}