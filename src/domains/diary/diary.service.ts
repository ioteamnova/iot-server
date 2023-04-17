import { UpdatePetDto } from './dto/pet-update.dto';
import { PetRepository } from './repositories/pet.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Pet } from './entities/pet.entity';
import { PageRequest } from 'src/core/page';
import { PetListDto } from './dto/pet-response.dto';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { asyncUploadToS3, S3FolderName } from 'src/utils/s3-utils';
import DateUtils from 'src/utils/date-utils';
import * as uuid from 'uuid';

@Injectable()
export class DiaryService {
  constructor(private petRepository: PetRepository) {}
  async createPet(
    dto: CreatePetDto,
    userIdx: number,
    file?: Express.Multer.File,
  ) {
    const imagePath = await this.uploadPetImage(file, userIdx);

    const pet = Pet.from(dto);
    pet.userIdx = userIdx;
    pet.imagePath = imagePath;

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

  async update(petIdx: number, dto: UpdatePetDto, file: Express.Multer.File) {
    const pet = await this.petRepository.findOne({
      where: {
        idx: petIdx,
      },
    });

    if (!pet) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_PET);
    }

    if (file) {
      const result = await this.uploadPetImage(file, petIdx);
      dto.imagePath = result;
    }

    const result = pet.updateFromDto(dto);
    await this.petRepository.save(pet);
    return result;
  }

  async removePet(petIdx: number) {
    const pet = await this.petRepository.findOne({
      where: {
        idx: petIdx,
      },
    });

    if (!pet) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_PET);
    }

    await this.petRepository.softDelete(petIdx);
  }

  async uploadPetImage(file: Express.Multer.File | undefined, idx: number) {
    if (!file) return;

    const folder = S3FolderName.PET;
    const fileName = `${idx}${DateUtils.momentFile()}-${uuid.v4()}-${
      file.originalname
    }`;
    const fileKey = `${folder}/${fileName}`;
    const result = await asyncUploadToS3(fileKey, file.buffer);
    return result.Location;
  }
}
