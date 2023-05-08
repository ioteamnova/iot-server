import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from "typeorm";

import { IotBoardPersonal } from './entities/iot-board-personal.entity';
import { IotBoardPersonalRepository } from './repositories/iot-board-personal.repository';
import { IotNaturerecordRepository } from './repositories/iot-nature-record.repository';
import { IotControlrecordRepository } from './repositories/iot-control-record.repository';
import { Page, PageRequest } from 'src/core/page';
import { IotBoardPersonalListDto } from './dtos/iot-board-personal-list.dto';
import { IotNaturePageRequest } from './dtos/iot-nature-page';

import { RecordTempListDto } from './dtos/record-temp-list.dto';
import { RecordHumidListDto } from './dtos/record-humid-list.dto';
import { RecordNatureListDto } from './dtos/record-nature-list.dto';
import { IotControlPageRequest } from './dtos/iot-control-page';
import { RecordControlListDto } from './dtos/record-control-list.dto';
import { RecordLightListDto } from './dtos/record-light-list.dto';
import { RecordWaterpumpListDto } from './dtos/record-waterpump-list.dto';
import { RecordcoolingfanListDto } from './dtos/record-coolingfan-list.dto';

@Injectable()
export class IotPersonalService {
    constructor(
        private iotBoardPersonalRepository : IotBoardPersonalRepository,
        private iotNaturerecordRepository : IotNaturerecordRepository,
        private iotControlrecordRepository : IotControlrecordRepository
    ){}


  /**
   *  보드 리스트
   * @param dto 보드 dto
   * @returns Iot_board_personal
   */
    async getBoardList(
      userIdx: number,
      pageRequest: PageRequest,
    ) {
      console.log(pageRequest);

      const [iotBoards, totalCount] = 
        await this.iotBoardPersonalRepository.findAndCountByUserIdx(userIdx, pageRequest);
        const items = iotBoards.map((board) => new IotBoardPersonalListDto(board));
      return new Page<IotBoardPersonalListDto>(totalCount, items, pageRequest);
    }
    
  /**
   *  온습도 통계 리스트 
   * @param dto 온습도 dto
   * @returns iot_naturerecord
   */
   async getNatureList(
    pageRequest: IotNaturePageRequest,
  ) {


    let firstdata = new Date(pageRequest.date);
    let secconddata = new Date(pageRequest.date);
    secconddata.setHours(secconddata.getHours() + 24);
    secconddata.setSeconds(secconddata.getSeconds() - 1);
    //console.log('date:::', new Date(firstdata));
    //console.log('date2:::', new Date(secconddata));

    const iotnaturel = await this.iotNaturerecordRepository.find({
      where: {
        boardIdx: pageRequest.boardIdx,
        createdAt: Between(
          new Date(firstdata), 
          new Date(secconddata)
        ),
      }
      
    })
    //console.log("iotnaturel ::: ");
    //console.log(iotnaturel);
    //console.log(iotnaturel.length);


    //온도와 습도 나눠서 dto만들고 조건에 맞춰서 변경하기. 
    if(pageRequest.sensor == "temp"){
      const items = iotnaturel.map((nature) => new RecordTempListDto(nature));
      return new Page<RecordTempListDto>(iotnaturel.length, items, pageRequest);
    }else if(pageRequest.sensor == "humid"){
      const items = iotnaturel.map((nature) => new RecordHumidListDto(nature));
      return new Page<RecordHumidListDto>(iotnaturel.length, items, pageRequest);
    }else{
      const items = iotnaturel.map((nature) => new RecordNatureListDto(nature));
      return new Page<RecordNatureListDto>(iotnaturel.length, items, pageRequest);
    }
  }



  /**
   *  제어모듈 통계 리스트 
   * @param dto 제어모듈 dto
   * @returns iot_controlrecord
   */
   async getControlList(
    pageRequest: IotControlPageRequest,
    ) {

      let firstdata = new Date(pageRequest.date);
      let secconddata = new Date(pageRequest.date);
      secconddata.setHours(secconddata.getHours() + 24);
      secconddata.setSeconds(secconddata.getSeconds() - 1);
      //console.log('date:::', new Date(firstdata));
      //console.log('date2:::', new Date(secconddata));
  
      const iotcontrol = await this.iotControlrecordRepository.find({
        where: {
          boardIdx: pageRequest.boardIdx,
          createdAt: Between(
            new Date(firstdata), 
            new Date(secconddata)
          ),
        }
        
      })
      //console.log("iotcontrol ::: ");
      //console.log(iotcontrol);
      //console.log(iotcontrol.length);
  
  
      //온도와 습도 나눠서 dto만들고 조건에 맞춰서 변경하기. 
      if(pageRequest.sensor == "light"){
        const items = iotcontrol.map((control) => new RecordLightListDto(control));
        return new Page<RecordLightListDto>(iotcontrol.length, items, pageRequest);
      }else if(pageRequest.sensor == "waterpump"){
        const items = iotcontrol.map((control) => new RecordWaterpumpListDto(control));
        return new Page<RecordWaterpumpListDto>(iotcontrol.length, items, pageRequest);
      }else if(pageRequest.sensor == "coolingfan"){
        const items = iotcontrol.map((control) => new RecordcoolingfanListDto(control));
        return new Page<RecordcoolingfanListDto>(iotcontrol.length, items, pageRequest);
      }else{
        const items = iotcontrol.map((control) => new RecordControlListDto(control));
        return new Page<RecordControlListDto>(iotcontrol.length, items, pageRequest);
      }
}

}



