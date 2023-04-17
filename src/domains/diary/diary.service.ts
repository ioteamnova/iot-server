import { PetRepository } from './repositories/pet.repository';
import { Injectable } from '@nestjs/common';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Pet } from './entities/pet.entity';
import { PageRequest } from 'src/core/page';
import { PetListDto } from './dto/pet-response.dto';

@Injectable()
export class DiaryService {
  constructor(private petRepository: PetRepository) {}
  async createPet(dto: CreatePetDto, userIdx: number) {
    const pet = Pet.from(dto);
    pet.userIdx = userIdx;

    return await this.petRepository.save(pet);
  }

  async findAll(
    userIdx: number,
    pageRequest: PageRequest,
  ): Promise<[Pet[], number]> {
    const pet = await this.petRepository.findAndCountByUserIdx(
      userIdx,
      pageRequest,
    );

    return pet;
  }

  findOne(id: number) {
    return `This action returns a #${id} diary`;
  }

  update(id: number, updateDiaryDto: UpdateDiaryDto) {
    return `This action updates a #${id} diary`;
  }

  remove(id: number) {
    return `This action removes a #${id} diary`;
  }
}
