import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Gender } from '../helpers/constants';

export class CreatePetDto {
  @ApiProperty({
    description: '반려동물 이름',
    default: '무근이',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '반려동물 종류',
    default: '크레스티드 게코',
    required: true,
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: '반려동물 성별',
    enum: Gender,
    default: Gender.NONE,
    required: false,
  })
  gender: Gender;

  @ApiProperty({
    description: '출생일',
    default: '2023-04-17',
    type: 'date',
    required: false,
  })
  birthDate: string;

  @ApiProperty({
    description: '입양일',
    type: 'date',
    default: '2023-04-17',
    required: false,
  })
  adoptionDate: string;

  @ApiProperty({
    description: '무게 (g)',
    default: 0,
    type: 'float',
    required: false,
  })
  weight: number;

  imagePath: string;
}
