import { ApiProperty, PartialType } from '@nestjs/swagger';
import { createBoardDto } from './create-board.dto';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdateBoardDto extends PartialType(createBoardDto) {
  @ValidateIf(
    (object) => object.category === 'adoption' || object.category === 'market',
  )
  @ApiProperty({
    description:
      '상품 관련 테이블 인덱스 *분양글 or 중고 마켓만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '12',
  })
  @IsNotEmpty()
  boardCommercialIdx: number;

  @ValidateIf(
    (object) => object.category === 'adoption' || object.category === 'market',
  )
  @ApiProperty({
    description:
      '가격 내용 *분양글 or 중고 마켓만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '90000',
  })
  @IsNotEmpty()
  price: number;

  @ValidateIf((object) => object.category === 'adoption')
  @ApiProperty({
    description:
      '성별 내용 *분양글만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '암컷',
  })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ValidateIf((object) => object.category === 'adoption')
  @ApiProperty({
    description:
      '크기 내용 *분양글에만 필요 나머지 게시판은 빈값으로 보내주세요.',
    default: '아성체',
  })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ValidateIf((object) => object.category === 'adoption')
  @ApiProperty({
    description: '*분양글만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '크레스티드 게코',
  })
  @IsString()
  @IsNotEmpty()
  variety: string;

  @ValidateIf((object) => object.category === 'adoption')
  @ApiProperty({
    description: '*분양글만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '릴리 화이트',
  })
  @IsString()
  @IsNotEmpty()
  pattern: string;

  @ValidateIf((object) => object.category === 'adoption')
  @ApiProperty({
    description: '*분양글만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '2023-06',
  })
  @IsString()
  @IsNotEmpty()
  birthDate: string;

  @ValidateIf((object) => object.category === 'auction')
  @ApiProperty({
    description: '내용 *경매글만 필요, 경매 번호.',
    default: '65',
  })
  @IsNotEmpty()
  auctionIdx: number;

  @ValidateIf((object) => object.category === 'auction')
  @ApiProperty({
    description: '품종 내용 *경매글만 필요, 상태',
    default: 'selling',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ValidateIf((object) => object.category === 'auction')
  @ApiProperty({
    description: '스트림키 *경매글만 필요, 스트림키.',
    default: '21Bu-CQfU-im7s-W7NJ-ArLV',
  })
  @IsString()
  @IsNotEmpty()
  streamKey: string;
}
