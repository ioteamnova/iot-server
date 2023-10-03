import { ApiProperty } from '@nestjs/swagger';
import { PageRequest } from 'src/core/page';

export class IotControlPageRequest extends PageRequest {
  @ApiProperty({
    description: '보드 인덱스',
    default: 66,
  })
  boardIdx: number;

  @ApiProperty({
    description: `센서 필터\n
        - 기본(전체)
        - uvb램프(uvb light)\n
        - 온열램프(heating light)\n
        - 워터펌프(waterpump)\n
        - 쿨링팬(coolingfan)`,
    enum: ['default', 'uvblight', 'heatinglight', 'waterpump', 'coolingfan'],
    default: 'default',
  })
  sensor: 'default' | 'uvblight' | 'heatinglight' | 'waterpump' | 'coolingfan';

  @ApiProperty({
    description: '선택한 날짜',
    default: '2023-05-07',
  })
  date: Date;
}
