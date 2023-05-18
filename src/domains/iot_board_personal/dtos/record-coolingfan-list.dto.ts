import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IotControlRecord } from '../entities/iot-control-record.entity';
import { CreateRecordDto } from './create-record.dto';

export class RecordcoolingfanListDto extends PartialType(CreateRecordDto) {
  @ApiProperty({
    description: '쿨링팬 현황',
    default: 1,
  })
  coolingFan: number;

  constructor(iotControlRecord: IotControlRecord) {
    super();
    this.idx = iotControlRecord.idx;
    this.coolingFan = iotControlRecord.coolingFan;
    this.type = iotControlRecord.type;
  }
}
