import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePetDto {
  @ApiProperty({
    description: '반려동물 이름',
    default: '무근이',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '반려동물 종류',
    default: '크레스티드 게코',
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: '반려동물 성별',
    default: '미구분',
  })
  gender: string;

  @ApiProperty({
    description: '출생일',
    default: '',
  })
  birthDate: string;

  @ApiProperty({
    description: '입양일',
    default: '',
  })
  adoptionDate: string;

  @ApiProperty({
    description: '무게 (g)',
    default: 0,
  })
  weight: string;
}
