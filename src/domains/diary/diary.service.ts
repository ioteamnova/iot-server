import { DiaryListDto } from './dtos/diary-list.dto';
import { DiaryRepository } from './repositories/diary.repository';
import { UpdatePetDto } from './dtos/pet-update.dto';
import { PetRepository } from './repositories/pet.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiaryDto } from './dtos/create-diary.dto';
import { CreatePetDto } from './dtos/create-pet.dto';
import { UpdateDiaryDto } from './dtos/update-diary.dto';
import { Pet } from './entities/pet.entity';
import { Page, PageRequest } from 'src/core/page';
import { PetListDto } from './dtos/pet-list.dto';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { asyncUploadToS3, S3FolderName } from 'src/utils/s3-utils';
import DateUtils from 'src/utils/date-utils';
import * as uuid from 'uuid';
import { Diary } from './entities/diary.entity';

@Injectable()
export class DiaryService {
  constructor(
    private petRepository: PetRepository,
    private diaryRepository: DiaryRepository,
  ) {}
  /**
   * 반려동물 정보 등록
   * @param dto CreatePetDto
   * @param userIdx 유저인덱스
   * @param file 이미지 파일
   * @returns 저장한 반려동물 정보
   */
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

  /**
   * 반려동물 목록 조회
   * @param userIdx 유저인덱스
   * @param pageRequest 페이징객체
   * @returns 반려동물 목록
   */
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

  /**
   * 반려동물 정보 수정
   * @param petIdx 반려동물 인덱스
   * @param dto UpdatePetDto
   * @param file 이미지 파일
   * @returns 반려동물 정보
   */
  async update(petIdx: number, dto: UpdatePetDto, file: Express.Multer.File) {
    const pet = await this.petRepository.findByPetIdx(petIdx);

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

  /**
   * 반려동물 정보 삭제
   * @param petIdx 반려동물 인덱스
   */
  async removePet(petIdx: number) {
    const pet = await this.petRepository.findByPetIdx(petIdx);

    if (!pet) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_PET);
    }

    await this.petRepository.softDelete(petIdx);
  }

  /**
   * 반려동물 이미지 업로드
   * @param file 이미지파일
   * @param idx 반려동물 인덱스
   * @returns 이미지 s3 url
   */
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

  /**
   * 반려동물의 다이어리 등록
   * @param petIdx 반려동물 인덱스
   * @param dto CreateDiaryDto
   * @returns 등록한 다이어리
   */
  async createDiary(petIdx: number, dto: CreateDiaryDto) {
    const pet = await this.petRepository.findByPetIdx(petIdx);
    if (!pet) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_PET);
    }
    const diary = Diary.from(dto);
    diary.petIdx = petIdx;
    return await this.diaryRepository.save(diary);
  }

  /**
   * 반려동물의 다이어리 목록
   * @param petIdx 반려동물 인덱스
   * @param pageRequest 페이징 객체
   * @returns 다이어리 목록
   */
  async findAllDiaries(
    petIdx: number,
    pageRequest: PageRequest,
  ): Promise<Page<DiaryListDto>> {
    const pet = await this.petRepository.findByPetIdx(petIdx);
    if (!pet) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_PET);
    }
    const [diaries, totalCount] =
      await this.diaryRepository.findAndCountByPetIdx(petIdx, pageRequest);
    const items = diaries.map((diary: Diary) => new DiaryListDto(diary));
    return new Page(totalCount, items, pageRequest);
  }

  async updateDiary(diaryIdx: number, dto: UpdateDiaryDto) {
    const diary = await this.diaryRepository.findOne({
      where: {
        idx: diaryIdx,
      },
    });
    if (!diary) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_DIARY);
    }
    const result = diary.updateFromDto(dto);
    return await this.diaryRepository.save(result);
  }
}
