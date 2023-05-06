import { Injectable } from '@nestjs/common';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { EntityRepository, Repository } from "typeorm";
import { iot_controlrecord } from '../entities/iot_controlrecord.entity';



@CustomRepository(iot_controlrecord)
export class IotControlrecordRepository extends Repository<iot_controlrecord> {
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