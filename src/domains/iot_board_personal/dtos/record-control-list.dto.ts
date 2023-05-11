import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IotControlRecord } from '../entities/iot-control-record.entity';
import { CreateRecordDto } from './create-record.dto';

export class RecordControlListDto extends PartialType(CreateRecordDto) {
  @ApiProperty({
    description: 'uvb 램프 현황',
    default: 1,
  })
  uvbLight: boolean;

  @ApiProperty({
    description: '온열 램프 현황',
    default: 1,
  })
  heatingLight: boolean;

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
    this.uvbLight = iotControlRecord.uvbLight;
    this.heatingLight = iotControlRecord.heatingLight;
    this.waterpump = iotControlRecord.waterPump;
    this.coolingfan = iotControlRecord.coolingFan;
    this.type = iotControlRecord.type;
  }
}
