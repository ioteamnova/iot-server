import { PetWeight } from './pet-weight.entity';
import { Diary } from './diary.entity';
import { UpdatePetDto } from '../dtos/pet-update.dto';
import BaseEntity from 'src/core/entity/base.entity';
import { User } from 'src/domains/user/entities/user.entity';
import { Column, ManyToOne, Entity, OneToMany } from 'typeorm';
import { Gender } from '../helpers/constants';

@Entity()
export class Pet extends BaseEntity {
  @Column()
  userIdx: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  gender: Gender;

  @Column()
  birthDate: Date;

  @Column()
  adoptionDate: Date;

  @Column()
  imagePath: string;

  @ManyToOne(() => User, (user) => user.pets)
  user: User;

  @OneToMany(() => Diary, (diary) => diary.pet)
  diaries: Diary[];

  @OneToMany(() => PetWeight, (petWeight) => petWeight.pet)
  petWeights: PetWeight[];

  static from({
    name,
    type,
    gender,
    birthDate,
    adoptionDate,
    imagePath,
  }: {
    name: string;
    type: string;
    gender: Gender;
    birthDate: Date;
    adoptionDate: Date;
    imagePath: string;
  }) {
    const pet = new Pet();
    pet.name = name;
    pet.type = type;
    pet.gender = gender;
    pet.birthDate = birthDate;
    pet.adoptionDate = adoptionDate;
    pet.imagePath = imagePath;

    return pet;
  }

  updateFromDto(dto: UpdatePetDto) {
    this.name = dto.name;
    this.type = dto.type;
    this.gender = dto.gender;
    this.birthDate = dto.birthDate;
    this.adoptionDate = dto.adoptionDate;
    this.imagePath = dto.imagePath;
  }
}
