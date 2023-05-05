import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PageRequest } from 'src/core/page';
export class PetWeightPageRequest extends OmitType(PageRequest, [
  'order',
] as const) {
  @ApiProperty({
    description: `필터\n
        - 기본(전체)
        - 주(week)\n
        - 월(month)\n
        - 년(year)`,
    enum: ['default', 'week', 'month', 'year'],
    default: 'default',
  })
  filter: 'default' | 'week' | 'month' | 'year';
}
