import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../helpers/constants';

export class PetDetailDto {
  @ApiProperty({
    description: '반려동물 인덱스',
    default: 1,
  })
  idx: number;

  @ApiProperty({
    description: '유저 인덱스',
    default: 1,
  })
  userIdx: number;

  @ApiProperty({
    description: '반려동물 이름',
    default: '무근이',
  })
  name: string;

  @ApiProperty({
    description: '반려동물 종류',
    default: '크레스티드 게코',
  })
  type: string;

  @ApiProperty({
    description: `성별
- NONE: 미구분
- MALE: 수컷
- FEMALE: 암컷`,
    enum: Gender,
    default: Gender.MALE,
  })
  gender: Gender;

  @ApiProperty({
    description: '출생일',
    default: '2023-04-18',
  })
  birthDate: string;

  @ApiProperty({
    description: '입양일',
    default: '2023-04-18',
  })
  adoptionDate: string;

  @ApiProperty({
    description: '체중(g)',
    default: 100.25,
  })
  weight: number;

  @ApiProperty({
    description: '생성일',
    default: new Date(),
  })
  createdAt: Date;
}
