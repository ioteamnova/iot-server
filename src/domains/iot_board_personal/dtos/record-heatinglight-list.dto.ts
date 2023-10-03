import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IotControlRecord } from '../entities/iot-control-record.entity';
import { RecordListDto } from './record-list.dto';

export class RecordHeatinglightListDto extends PartialType(RecordListDto) {
  @ApiProperty({
    description: '온열 램프 현황',
    default: 1,
  })
  heatingLight: number;

  constructor(iotControlRecord: IotControlRecord) {
    super();
    this.idx = iotControlRecord.idx;
    this.heatingLight = iotControlRecord.heatingLight;
    this.type = iotControlRecord.type;
  }
}
