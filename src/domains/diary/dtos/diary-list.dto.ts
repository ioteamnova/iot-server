import { ApiProperty } from '@nestjs/swagger';
import { Diary } from '../entities/diary.entity';

export class DiaryListDto {
  @ApiProperty({
    description: '다이어리 인덱스',
    default: 1,
  })
  idx: number;

  @ApiProperty({
    description: '다이어리 제목',
    default: '제목',
  })
  title: string;

  @ApiProperty({
    description: '다이어리 내용',
    default: '다이어리 내용입니다.',
  })
  content: string;

  constructor(diary: Diary) {
    this.idx = diary.idx;
    this.title = diary.title;
    this.content = diary.content;
  }
}
