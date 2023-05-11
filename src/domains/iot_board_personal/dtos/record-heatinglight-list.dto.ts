import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IotControlRecord } from '../entities/iot-control-record.entity';
import { CreateRecordDto } from './create-record.dto';

export class RecordHeatinglightListDto extends PartialType(CreateRecordDto) {
  @ApiProperty({
    description: '온열 램프 현황',
    default: 1,
  })
  heatingLight: boolean;

  constructor(iotControlRecord: IotControlRecord) {
    super();
    this.idx = iotControlRecord.idx;
    this.heatingLight = iotControlRecord.heatingLight;
    this.type = iotControlRecord.type;
  }
}
