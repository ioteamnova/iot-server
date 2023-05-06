import { Injectable } from '@nestjs/common';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { EntityRepository, Repository } from "typeorm";
import { iot_naturerecord } from '../entities/iot_naturerecord.entity';



@CustomRepository(iot_naturerecord)
export class IotNaturerecordRepository extends Repository<iot_naturerecord> {
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