import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IotNatureRecord } from '../entities/iot-nature-record.entity';
import { CreateNatureRecordDto } from './create-nature-record.dto';

export class RecordHumidListDto extends PartialType(CreateNatureRecordDto) {
  @ApiProperty({
    description: '현재 습도 1',
    default: 'true',
  })
  currentHumid: string;

  @ApiProperty({
    description: '현재 습도 2',
    default: 'true',
  })
  currentHumid2: string;

  constructor(iotNatureRecord: IotNatureRecord) {
    super();
    this.idx = iotNatureRecord.idx;
    this.currentHumid = iotNatureRecord.currentHumid;
    this.currentHumid2 = iotNatureRecord.currentHumid2;
    this.type = iotNatureRecord.type;
  }
}
