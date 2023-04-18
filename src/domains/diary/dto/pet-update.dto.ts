import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Gender } from '../helpers/constants';

export class UpdatePetDto {
  @ApiProperty({
    description: '반려동물 이름',
    default: '무근이',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: '반려동물 종류',
    default: '크레스티드 게코',
  })
  @IsString()
  @IsOptional()
  type: string;

  @ApiProperty({
    description: `성별
- NONE: 미구분
- MALE: 수컷
- FEMALE: 암컷`,
    enum: Gender,
    default: Gender.MALE,
  })
  @IsOptional()
  gender: Gender;

  @ApiProperty({
    description: '출생일',
    default: '2023-04-18',
  })
  @IsOptional()
  birthDate: string;

  @ApiProperty({
    description: '입양일',
    default: '2023-04-18',
  })
  @IsOptional()
  adoptionDate: string;

  @ApiProperty({
    description: '체중(g)',
    default: 100.25,
  })
  @IsOptional()
  weight: number;

  imagePath: string;
}
