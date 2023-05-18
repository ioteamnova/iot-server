import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IotControlRecord } from '../entities/iot-control-record.entity';
import { CreateRecordDto } from './create-record.dto';

export class RecordUvblightListDto extends PartialType(CreateRecordDto) {
  @ApiProperty({
    description: 'uvb 램프 현황',
    default: 1,
  })
  uvbLight: number;

  constructor(iotControlRecord: IotControlRecord) {
    super();
    this.idx = iotControlRecord.idx;
    this.uvbLight = iotControlRecord.uvbLight;
    this.type = iotControlRecord.type;
  }
}
