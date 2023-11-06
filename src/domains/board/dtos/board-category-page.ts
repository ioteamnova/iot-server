import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PageRequest } from 'src/core/page';

export class BoardCategoryPageRequest extends PageRequest {

  @ApiProperty({
    description: '정렬 기준',
    required: true,
    default: 'created',
    enum: ['created', 'view', 'price'],
  })
  @IsOptional()
  orderCriteria?: 'created' | 'view' | 'price';


  @ApiProperty({
    description: `보드 카테고리\n
        - 기본(전체)
        - 중고거래\n
        - 분양\n
        - 경매`,
    enum: ['free', 'ask', 'market', 'adoption', 'auction'],
    default: 'free',
  })
  category: 'free' | 'ask' | 'market' | 'adoption' | 'auction';
  
}
