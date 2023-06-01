import { UpdatePetWeightDto } from './../dtos/update-pet-weight.dto';
import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Pet } from './pet.entity';

@Entity()
export class PetWeight extends BaseEntity {
  @Column()
  petIdx: number;

  @Column()
  weight: number;

  @Column({
    type: 'date',
    transformer: { to: (value) => value, from: (value) => value },
  })
  date: Date;

  @ManyToOne(() => Pet, (pet) => pet.petWeights)
  @JoinColumn({ name: 'pet_idx' })
  pet: Pet;

  static from({ weight, date }: { weight: number; date: Date }) {
    const petWeight = new PetWeight();
    petWeight.weight = weight;
    petWeight.date = date;

    return petWeight;
  }

  updateFromDto(dto: UpdatePetWeightDto) {
    this.weight = dto.weight;
    this.date = dto.date;
  }
}
