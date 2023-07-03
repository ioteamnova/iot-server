import { UpdatePetWeightDto } from './../dtos/update-pet-weight.dto';
import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Pet } from './pet.entity';

@Entity()
export class PetWeight extends BaseEntity {
  @Column()
  petIdx: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
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
    petWeight.weight = parseFloat(weight.toFixed(2));
    petWeight.date = date;
    return petWeight;
  }

  updateFromDto(dto: UpdatePetWeightDto) {
    this.weight = parseFloat(dto.weight.toFixed(2));
    this.date = dto.date;
  }
}
