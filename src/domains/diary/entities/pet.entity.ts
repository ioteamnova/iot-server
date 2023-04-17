import { UpdatePetDto } from '../dto/pet-update.dto';
import BaseEntity from 'src/core/entity/base.entity';
import { User } from 'src/domains/user/entities/user.entity';
import { Column, ManyToOne, Entity } from 'typeorm';
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
  birthDate: string;

  @Column()
  adoptionDate: string;

  @Column()
  weight: number;

  @Column()
  imagePath: string;

  @ManyToOne(() => User, (user) => user.pets)
  user: User;

  static from({
    name,
    type,
    gender,
    birthDate,
    adoptionDate,
    weight,
    imagePath,
  }: {
    name: string;
    type: string;
    gender: Gender;
    birthDate: string;
    adoptionDate: string;
    weight: number;
    imagePath: string;
  }) {
    const pet = new Pet();
    pet.name = name;
    pet.type = type;
    pet.gender = gender;
    pet.birthDate = birthDate;
    pet.adoptionDate = adoptionDate;
    pet.weight = weight;
    pet.imagePath = imagePath;

    return pet;
  }

  updateFromDto(dto: UpdatePetDto) {
    this.name = dto.name;
    this.type = dto.type;
    this.gender = dto.gender;
    this.birthDate = dto.birthDate;
    this.adoptionDate = dto.adoptionDate;
    this.weight = dto.weight;
    this.imagePath = dto.imagePath;
  }
}
