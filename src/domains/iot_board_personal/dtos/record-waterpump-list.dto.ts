import { ApiProperty } from '@nestjs/swagger';
import DateUtils from 'src/utils/date-utils';
import { iot_control_record } from '../entities/iot_control_record.entity';

export class RecordWaterpumpListDto {
  @ApiProperty({
    description: '제어모듈 리스트 인덱스',
    default: 1,
  })
  idx: number;

  // @ApiProperty({
  //   description: '조광기 현황',
  //   default: 1,
  // })  
  // light: boolean;

  @ApiProperty({
    description: '워터펌프 현황',
    default: 1,
  })  
  waterpump: boolean;

  // @ApiProperty({
  //   description: '쿨링팬 현황',
  //   default: 1,
  // })  
  // coolingfan: boolean;

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

  constructor(iot_control_record: iot_control_record) {
    this.idx = iot_control_record.idx;
    // this.light = iot_control_record.light;
    this.waterpump = iot_control_record.waterpump;
    // this.coolingfan = iot_control_record.coolingfan;
    this.type = iot_control_record.type;
  }
}
