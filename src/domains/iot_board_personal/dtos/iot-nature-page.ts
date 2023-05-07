import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PageRequest } from 'src/core/page';
import DateUtils from 'src/utils/date-utils';

export class IotNaturePageRequest extends PageRequest {


  @ApiProperty({
    description: '보드 인덱스',
    //enum: ['default', 'week', 'month', 'year'],
    default: 66,
  })
  boardIdx: number;

  @ApiProperty({
    description: `센서 필터\n
        - 기본(전체)
        - 온도(temp)\n
        - 습도(humid)`,
    enum: ['default', 'temp', 'humid'],
    default: 'default',
  })
  sensor: 'default' | 'temp' | 'humid';

  @ApiProperty({
    description: '선택한 날짜',
    default: "2023-05-07",
  })
  date: Date;
}
