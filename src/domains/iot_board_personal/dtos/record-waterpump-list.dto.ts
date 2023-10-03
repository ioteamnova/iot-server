import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IotControlRecord } from '../entities/iot-control-record.entity';
import { RecordListDto } from './record-list.dto';

export class RecordWaterpumpListDto extends PartialType(RecordListDto) {
  @ApiProperty({
    description: '워터펌프 현황',
    default: 1,
  })
  waterPump: number;

  constructor(iotControlRecord: IotControlRecord) {
    super();
    this.idx = iotControlRecord.idx;
    this.waterPump = iotControlRecord.waterPump;
    this.type = iotControlRecord.type;
  }
}
