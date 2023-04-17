import { PetDetailDto } from './pet-detail.dto';
import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../helpers/constants';
import { Pet } from '../entities/pet.entity';

export class PetListDto extends PickType(PetDetailDto, [
  'idx',
  'name',
  'type',
  'gender',
] as const) {
  // @ApiProperty({
  //   description: '반려동물 인덱스',
  //   default: 1,
  // })
  // idx: number;
  // @ApiProperty({
  //   description: '반려동물 이름',
  //   default: '무근이',
  // })
  // name: string;
  // @ApiProperty({
  //   description: '반려동물 종류',
  //   default: '크레스티드 게코',
  // })
  // type: string;
  // @ApiProperty({
  //   description: `성별
  // - NONE: 미구분
  // - MALE: 수컷
  // - FEMALE: 암컷`,
  //   enum: Gender,
  //   default: Gender.MALE,
  // })
  // gender: Gender;
  constructor(pet: Pet) {
    super();
    this.idx = pet.idx;
    this.name = pet.name;
    this.type = pet.type;
    this.gender = pet.gender;
  }
}
