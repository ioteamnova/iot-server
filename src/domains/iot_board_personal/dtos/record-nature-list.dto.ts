import { ApiProperty } from '@nestjs/swagger';
import DateUtils from 'src/utils/date-utils';
import { IotNatureRecord } from '../entities/iot-nature-record.entity';

export class RecordNatureListDto {
  @ApiProperty({
    description: '온습도 리스트 인덱스',
    default: 1,
  })
  idx: number;

  @ApiProperty({
    description: '현재 온도 1',
    default: '0.0',
  })
  currentTemp: string;

  @ApiProperty({
    description: '현재 습도 1',
    default: 'true',
  })
  currentHumid: string;

  @ApiProperty({
    description: '현재 온도 2',
    default: 'true',
  })
  currentTemp2: string;

  @ApiProperty({
    description: '현재 습도 2',
    default: 'true',
  })
  currentHumid2: string;

  @ApiProperty({
    description: '자동, 수동 여부 1. auto, 2. passive',
    default: 1,
  })
  type: number;

  @ApiProperty({
    description: '생성일',
    default: DateUtils.momentNow(),
  })
  createdAt: Date;

  constructor(iotNatureRecord: IotNatureRecord) {
    this.idx = iotNatureRecord.idx;
    this.currentTemp = iotNatureRecord.currentTemp;
   this.currentHumid = iotNatureRecord.currentHumid;
    this.currentTemp2 = iotNatureRecord.currentTemp2;
    this.currentHumid2 = iotNatureRecord.currentHumid2;
    this.type = iotNatureRecord.type;
  }
}
