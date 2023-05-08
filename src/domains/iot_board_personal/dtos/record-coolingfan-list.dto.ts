import { ApiProperty } from '@nestjs/swagger';
import DateUtils from 'src/utils/date-utils';
import { IotControlRecord } from '../entities/iot-control-record.entity';

export class RecordcoolingfanListDto {
  @ApiProperty({
    description: '제어모듈 리스트 인덱스',
    default: 1,
  })
  idx: number;

  @ApiProperty({
    description: '쿨링팬 현황',
    default: 1,
  })
  coolingfan: boolean;

  @ApiProperty({
    description: '자동, 수동 여부 1. auto, 2. passive',
    default: 1,
  })
  type: number;

  @ApiProperty({
    description: '생성일',
    default: DateUtils.momentNow(),
  })
  createdAt: Date;

  constructor(iotControlRecord: IotControlRecord) {
    this.idx = iotControlRecord.idx;
    this.coolingfan = iotControlRecord.coolingfan;
    this.type = iotControlRecord.type;
  }
}
