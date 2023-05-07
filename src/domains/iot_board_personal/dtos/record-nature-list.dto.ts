import { ApiProperty } from '@nestjs/swagger';
import DateUtils from 'src/utils/date-utils';
import { iot_nature_record } from '../entities/iot_nature_record.entity';

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
  current2Temp: string;

  @ApiProperty({
    description: '현재 습도 2',
    default: 'true',
  })
  current2Humid: string;

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

  constructor(iot_nature_record: iot_nature_record) {
    this.idx = iot_nature_record.idx;
    this.currentTemp = iot_nature_record.currentTemp;
   this.currentHumid = iot_nature_record.currentHumid;
    this.current2Temp = iot_nature_record.current2Temp;
    this.current2Humid = iot_nature_record.current2Humid;
    this.type = iot_nature_record.type;
  }
}
