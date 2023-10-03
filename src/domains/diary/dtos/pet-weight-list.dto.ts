import { PetWeight } from './../entities/pet-weight.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePetWeightDto } from './create-pet-weight.dto';

export class PetWeightListDto extends PartialType(CreatePetWeightDto) {
  @ApiProperty({
    description: '인덱스',
    default: 1,
  })
  idx: number;

  @ApiProperty({
    description: '인덱스',
    default: 1,
  })
  weightChange: number;

  constructor(petWeight: PetWeight, weightChange: number) {
    super();
    this.idx = petWeight.idx;
    this.weight = petWeight.weight;
    this.date = petWeight.date;
    this.weightChange = weightChange;
  }
}
