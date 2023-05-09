import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IotControlRecord } from '../entities/iot-control-record.entity';
import { CreateControlRecordDto } from './create-control-record.dto';

export class RecordcoolingfanListDto extends PartialType(
  CreateControlRecordDto,
) {
  @ApiProperty({
    description: '쿨링팬 현황',
    default: 1,
  })
  coolingfan: boolean;

  constructor(iotControlRecord: IotControlRecord) {
    super();
    this.idx = iotControlRecord.idx;
    this.coolingfan = iotControlRecord.coolingfan;
    this.type = iotControlRecord.type;
  }
}
