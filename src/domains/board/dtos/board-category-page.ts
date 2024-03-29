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
    enum: [
      'free',
      'ask',
      'market',
      'adoption',
      'auction',
      'auctionSelling',
      'auctionTemp',
      'auctionEnd',
    ],
    default: 'free',
  })
  category:
    | 'free'
    | 'ask'
    | 'market'
    | 'adoption'
    | 'adoption'
    | 'auctionSelling'
    | 'auctionTemp'
    | 'auctionEnd';

  @ApiProperty({
    description:
      '로그인 되어 있으면, 로그인된 유저 idx 넣어주세요. 로그인 되어있지 않으면 안넣으시면 됩니다. *검색은 안넣으셔도 됩니다!!',
    required: true,
    default: 65,
  })
  @IsOptional()
  userIdx?: number;
}
