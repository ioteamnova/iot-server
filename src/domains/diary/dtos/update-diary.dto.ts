import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateDiaryDto } from './create-diary.dto';

export class UpdateDiaryDto extends PartialType(CreateDiaryDto) {
  @ApiProperty({
    description: '다이어리 이미지 url',
    default: ['https://image1'],
  })
  @IsOptional()
  @IsString()
  imagePaths: string[];
}
