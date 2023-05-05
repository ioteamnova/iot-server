import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Iot_personal } from './entities/iot_personal.entity';
import { IotPersonalRepository } from './repositories/iot_personal.repository';

@Injectable()
export class IotPersonalService {
    constructor(
        @InjectRepository(IotPersonalRepository) 
        private iotPersonalRepository : IotPersonalRepository
    ){}


  /**
   *  보드 리스트
   * @param dto 보드 dto
   * @returns iot_personal
   */
    async getBoardList(uid:number, offset:number, limit:number) {

        const boardlist = await this.iotPersonalRepository.createQueryBuilder('iot_personal')
        .leftJoinAndSelect('iot_personal.pet', 'pet') // 어떤 테이블과 연결
        .where({ userIdx: uid })
        .offset(offset)
        .limit(limit)
        //.getManyAndCount();
        .getMany();
        console.log(boardlist);

        // return await this.iotPersonalRepository.find({ 
        //     relations: {
        //         pet: true,
        //     },
        //     where: { userIdx: uid },
        // });
       return boardlist;
    }
    
  /**
   *  온습도 통계 리스트 
   * @param dto 온습도 dto
   * @returns iot_naturerecord
   */




  /**
   *  제어모듈 통계 리스트 
   * @param dto 제어모듈 dto
   * @returns iot_controlrecord
   */


}



