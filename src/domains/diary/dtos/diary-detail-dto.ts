import { ApiProperty } from '@nestjs/swagger';

export class DiaryDetailDto {
  @ApiProperty({
    description: '다이어리 인덱스',
    default: 1,
  })
  idx: number;

  @ApiProperty({
    description: '다이어리 제목',
    default: '다이어리 제목',
  })
  title: string;

  @ApiProperty({
    description: '다이어리 내용',
    default: '다이어리 내용입니다.',
  })
  content: string;
}
