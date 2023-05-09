import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IotControlRecord } from '../entities/iot-control-record.entity';
import { CreateControlRecordDto } from './create-control-record.dto';

export class RecordLightListDto extends PartialType(CreateControlRecordDto) {
  @ApiProperty({
    description: '조광기 현황',
    default: 1,
  })
  light: boolean;

  constructor(iotControlRecord: IotControlRecord) {
    super();
    this.idx = iotControlRecord.idx;
    this.light = iotControlRecord.light;
    this.type = iotControlRecord.type;
  }
}
