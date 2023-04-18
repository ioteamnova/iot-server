import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDiaryDto {
  @ApiProperty({
    description: '다이어리 제목',
    default: '다이어리 제목',
    required: true,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '다이어리 내용',
    default: '다이어리 내용입니다.',
    required: false,
  })
  @IsOptional()
  content: string;
}
