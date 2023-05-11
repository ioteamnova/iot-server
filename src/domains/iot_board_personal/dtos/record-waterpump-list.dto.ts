import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IotControlRecord } from '../entities/iot-control-record.entity';
import { CreateRecordDto } from './create-record.dto';

export class RecordWaterpumpListDto extends PartialType(CreateRecordDto) {
  @ApiProperty({
    description: '워터펌프 현황',
    default: 1,
  })
  waterPump: boolean;

  constructor(iotControlRecord: IotControlRecord) {
    super();
    this.idx = iotControlRecord.idx;
    this.waterPump = iotControlRecord.waterPump;
    this.type = iotControlRecord.type;
  }
}
