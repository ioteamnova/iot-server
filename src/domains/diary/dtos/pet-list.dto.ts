import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../helpers/constants';
import { Pet } from '../entities/pet.entity';
import { IsOptional, IsString } from 'class-validator';

export class PetListDto {
  @ApiProperty({
    description: '반려동물 인덱스',
    default: 1,
  })
  idx: number;

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

  @ApiProperty({
    description: '이미지 url',
    default: null,
  })
  @IsOptional()
  imagePath: string;

  constructor(pet: Pet) {
    this.idx = pet.idx;
    this.name = pet.name;
    this.type = pet.type;
    this.gender = pet.gender;
    this.imagePath = pet.imagePath;
  }
}
