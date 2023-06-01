import { ApiProperty } from '@nestjs/swagger';
import { PageRequest } from 'src/core/page';
export class PetWeightPageRequest extends PageRequest {
  @ApiProperty({
    description: `필터\n
        - 기본(전체): 날짜기준으로 정렬
        - 주(week): 오늘날짜로부터 7일이내의 데이터 (최대 7개)
        - 월(month): 오늘날짜로부터 30일이내의 데이터. (최대 30개)
        - 년(year): 오늘날짜로부터 1년이내의 데이터의 월별 평균`,
    enum: ['default', 'week', 'month', 'year'],
    default: 'default',
  })
  filter: 'default' | 'week' | 'month' | 'year';

  get limit(): number {
    if (this.filter === 'month') {
      return 30; // 월(month) 필터의 경우 30을 반환
    }
    return super.limit; // 다른 필터의 경우 기존의 limit 값 반환
  }
}
