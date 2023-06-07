import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { BoardStatus } from '../board-status.enum';

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
    default: '자유 게시판',
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
}
