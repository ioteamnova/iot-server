import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IotControlRecord } from '../entities/iot-control-record.entity';
import { CreateControlRecordDto } from './create-control-record.dto';

export class RecordWaterpumpListDto extends PartialType(
  CreateControlRecordDto,
) {
  @ApiProperty({
    description: '워터펌프 현황',
    default: 1,
  })
  waterpump: boolean;

  constructor(iotControlRecord: IotControlRecord) {
    super();
    this.idx = iotControlRecord.idx;
    this.waterpump = iotControlRecord.waterpump;
    this.type = iotControlRecord.type;
  }
}
