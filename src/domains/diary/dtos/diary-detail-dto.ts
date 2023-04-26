import { ApiProperty, OmitType } from '@nestjs/swagger';
import { DiaryListDto } from './diary-list.dto';

export class DiaryDetailDto extends OmitType(DiaryListDto, [
  'imagePath',
] as const) {
  @ApiProperty({
    description: '다이어리 이미지 url',
    default: ['https://image1', 'https://image2', 'https://image3'],
  })
  imagePaths: string[];
}
