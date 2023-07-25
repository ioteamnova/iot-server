import { ApiProperty } from '@nestjs/swagger';
import { PageRequest } from 'src/core/page';

export class BoardCategoryPageRequest extends PageRequest {
  @ApiProperty({
    description: `보드 카테고리\n
        - 기본(전체)
        - 중고거래\n
        - 분양\n
        - 경매`,
    enum: ['free', 'market', 'adoption', 'action'],
    default: 'free',
  })
  category: 'free' | 'market' | 'adoption' | 'action';
}
