import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDiaryDto } from './create-diary.dto';

export class DiaryDetailDto extends PartialType(CreateDiaryDto) {
  @ApiProperty({
    description: '다이어리 인덱스',
    default: 1,
  })
  idx: number;

  @ApiProperty({
    description: '다이어리 이미지 url',
    default: ['https://image1', 'https://image2', 'https://image3'],
  })
  imagePaths: string[];
}
