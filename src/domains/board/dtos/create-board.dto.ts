import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class createBoardDto {
  @ApiProperty({
    description: '유저 번호',
    default: 1,
  })
  userIdx: number;

  @ApiProperty({
    description: '제목?',
    default: '안녕하세요.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  title: string;

  @ApiProperty({
    description: '어떤 게시판인가?',
    default: 'free',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: '게시글 내용',
    default: '게시글에 대한 내용입니다.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ValidateIf(
    (object, value) =>
      object.category === 'adoption' || object.category === 'market',
  )
  @ApiProperty({
    description:
      '가격 내용 *분양글 or 중고 마켓만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '90000',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ValidateIf((object, value) => object.category === 'adoption')
  @ApiProperty({
    description:
      '성별 내용 *분양글만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '암컷',
  })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ValidateIf((object, value) => object.category === 'adoption')
  @ApiProperty({
    description:
      '크기 내용 *분양글에만 필요 나머지 게시판은 빈값으로 보내주세요.',
    default: '아성체',
  })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ValidateIf((object, value) => object.category === 'adoption')
  @ApiProperty({
    description:
      '품종 내용 *분양글만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '크레스티드 게코',
  })
  @IsString()
  @IsNotEmpty()
  variety: string;
}
