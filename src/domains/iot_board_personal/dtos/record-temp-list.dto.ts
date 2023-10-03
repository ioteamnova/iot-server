import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IotNatureRecord } from '../entities/iot-nature-record.entity';
import { RecordListDto } from './record-list.dto';

export class RecordTempListDto extends PartialType(RecordListDto) {
  @ApiProperty({
    description: '현재 온도 1',
    default: '0.0',
  })
  currentTemp: string;

  @ApiProperty({
    description: '현재 온도 2',
    default: 'true',
  })
  currentTemp2: string;

  constructor(iotNatureRecord: IotNatureRecord) {
    super();
    this.idx = iotNatureRecord.idx;
    this.currentTemp = iotNatureRecord.currentTemp;
    this.currentTemp2 = iotNatureRecord.currentTemp2;
    this.type = iotNatureRecord.type;
  }
}
