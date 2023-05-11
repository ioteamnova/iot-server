import { ApiProperty } from '@nestjs/swagger';
import DateUtils from 'src/utils/date-utils';

export class CreateRecordDto {
  @ApiProperty({
    description: '인덱스',
    default: 1,
  })
  idx: number;

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
}
