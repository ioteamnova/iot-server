import { ApiProperty } from '@nestjs/swagger';
import DateUtils from 'src/utils/date-utils';
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

  @ApiProperty({
    description: '다이어리 대표(첫번째) 이미지 url',
    default: 'https://image1',
  })
  imagePath: string;

  @ApiProperty({
    description: '생성일',
    default: DateUtils.momentNow(),
  })
  createdAt: Date;

  constructor(diary: Diary) {
    let imagePath = '';
    if (diary.images[0]) {
      imagePath = diary.images[0].imagePath;
    }
    this.idx = diary.idx;
    this.title = diary.title;
    this.content = diary.content;
    this.imagePath = imagePath;
    this.createdAt = diary.createdAt;
  }
}
