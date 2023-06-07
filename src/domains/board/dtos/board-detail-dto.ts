import { ApiProperty, OmitType } from '@nestjs/swagger';
import { BoardInfoDto } from './boardInfo.dto';

export class BoardDetailDto extends OmitType(BoardInfoDto, [
  'thumbnail',
] as const) {
  @ApiProperty({
    description: '다이어리 이미지 url',
    default: ['https://image1', 'https://image2', 'https://image3'],
  })
  imagePaths: string[];
}
