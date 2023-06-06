import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class BoardInfoDto {
  @ApiProperty({
    description: '닉네임',
    default: '디노마켓',
  })
  @IsString()
  @MaxLength(32)
  @IsNotEmpty()
  idx: number;

  @ApiProperty({
    description: '닉네임',
    default: '디노마켓',
  })
  @IsString()
  @MaxLength(32)
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    description: '어떤 게시판인가?',
    default: '자유 게시판',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: '제목?',
    default: '안녕하세요.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  title: string;

  @ApiProperty({
    description: '썸네일 사진 주소',
    default: 'https://reptimate.com/fdasfewgfadsharredhasdf.jpg',
  })
  @IsString()
  thumbnail: string;

  @ApiProperty({
    description: '게시글 내용',
    default: '게시글에 대한 내용입니다.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '조회수 입니다',
    default: '187',
  })
  @IsString()
  @IsNotEmpty()
  replyCnt: number;

  @ApiProperty({
    description: '작성일',
    type: 'date',
    default: '2023-04-17',
    required: false,
  })
  @IsNotEmpty()
  writeDate: Date;
}
