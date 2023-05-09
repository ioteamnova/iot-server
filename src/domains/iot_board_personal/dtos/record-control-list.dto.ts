import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IotControlRecord } from '../entities/iot-control-record.entity';
import { CreateControlRecordDto } from './create-control-record.dto';

export class RecordControlListDto extends PartialType(CreateControlRecordDto) {
  @ApiProperty({
    description: '조광기 현황',
    default: 1,
  })
  light: boolean;

  @ApiProperty({
    description: '워터펌프 현황',
    default: 1,
  })
  waterpump: boolean;

  @ApiProperty({
    description: '쿨링팬 현황',
    default: 1,
  })
  coolingfan: boolean;

  constructor(iotControlRecord: IotControlRecord) {
    super();
    this.idx = iotControlRecord.idx;
    this.light = iotControlRecord.light;
    this.waterpump = iotControlRecord.waterpump;
    this.coolingfan = iotControlRecord.coolingfan;
    this.type = iotControlRecord.type;
  }
}
