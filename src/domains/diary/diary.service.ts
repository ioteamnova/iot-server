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
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { asyncUploadToS3, S3FolderName } from 'src/utils/s3-utils';
import DateUtils from 'src/utils/date-utils';
import * as uuid from 'uuid';
import { Diary } from './entities/diary.entity';
import { DiaryImage } from './entities/diary-image.entity';
import { DiaryImageRepository } from './repositories/diary-image.repository';

@Injectable()
export class DiaryService {
  constructor(
    private petRepository: PetRepository,
    private diaryRepository: DiaryRepository,
    private diaryImageRepository: DiaryImageRepository,
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
    file: Express.Multer.File,
  ) {
    const pet = Pet.from(dto);
    pet.userIdx = userIdx;

    if (file) {
      const imagePath = await this.uploadImageToS3(file, S3FolderName.PET);
      pet.imagePath = imagePath;
    }

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
      const imagePath = await this.uploadImageToS3(file, S3FolderName.PET);
      dto.imagePath = imagePath;
    }
    pet.updateFromDto(dto);
    const result = await this.petRepository.save(pet);
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
   * 이미지 업로드
   * @param file 이미지파일
   * @returns 이미지 s3 url
   */
  async uploadImageToS3(file: Express.Multer.File, folder: string) {
    const fileName = `${DateUtils.momentFile()}-${uuid.v4()}-${
      file.originalname
    }`;
    const fileKey = `${folder}/${fileName}`;
    const result = await asyncUploadToS3(fileKey, file.buffer);
    return result.Location;
  }

  // async createDiary(
  //   petIdx: number,
  //   dto: CreateDiaryDto,
  //   files: Array<Express.Multer.File>,
  // ) {
  //   const pet = await this.petRepository.findByPetIdx(petIdx);
  //   if (!pet) {
  //     throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_PET);
  //   }

  //   const diary = Diary.from(dto);
  //   diary.petIdx = petIdx;
  //   await this.diaryRepository.save(diary);

  //   if (!files) {
  //     return diary;
  //   }

  //   const urls = [];
  //   for (const file of files) {
  //     const folder = S3FolderName.DIARY;
  //     const fileName = `${petIdx}-${DateUtils.momentFile()}-${uuid.v4()}-${
  //       file.originalname
  //     }`;
  //     const fileKey = `${folder}/${fileName}`;
  //     const result = await asyncUploadToS3(fileKey, file.buffer);
  //     const image = new DiaryImage();
  //     image.diaryIdx = diary.idx;
  //     image.imagePath = result.Location;
  //     await this.diaryImageRepository.save(image);
  //     urls.push(image.imagePath);
  //   }
  //   return {
  //     ...diary,
  //     images: urls,
  //   };
  // }

  // 리팩토링
  /**
   * 반려동물의 다이어리 등록
   * @param petIdx 반려동물 인덱스
   * @param dto CreateDiaryDto
   * @returns 등록한 다이어리
   */
  async createDiary(
    petIdx: number,
    dto: CreateDiaryDto,
    files: Array<Express.Multer.File>,
  ) {
    const pet = await this.petRepository.findByPetIdx(petIdx);
    if (!pet) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_PET);
    }

    const diary = Diary.from(dto);
    diary.petIdx = petIdx;
    await this.diaryRepository.save(diary);

    if (files) {
      const images = await this.uploadDiaryImages(files, diary.idx);
      diary.images = images;
    }

    return {
      ...diary,
      images: diary.images,
    };
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
    const items = diaries.map((diary) => new DiaryListDto(diary));
    return new Page<DiaryListDto>(totalCount, items, pageRequest);
  }
  /**
   * 다이어리 상세 조회
   * @param diaryIdx 다이어리 인덱스
   * @returns 다이어리
   */
  async findDiary(petIdx: number, diaryIdx: number) {
    const pet = await this.petRepository.findByPetIdx(petIdx);
    if (!pet) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_PET);
    }

    const diary = await this.diaryRepository.findOne({
      where: {
        idx: diaryIdx,
      },
      relations: ['images'],
    });
    if (!diary) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_DIARY);
    }

    return diary;
  }

  // async updateDiary(
  //   diaryIdx: number,
  //   dto: UpdateDiaryDto,
  //   files: Array<Express.Multer.File>,
  // ) {
  //   const diary = await this.diaryRepository.findOne({
  //     where: {
  //       idx: diaryIdx,
  //     },
  //     relations: ['images'],
  //   });

  //   if (!diary) {
  //     throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_DIARY);
  //   }

  //   if (!files) {
  //     return diary;
  //   }

  //   // 기존 이미지 삭제
  //   const images = diary.images;
  //   await this.diaryImageRepository.softRemove(images);

  //   // 새로운 이미지 저장
  //   for (const file of files) {
  //     const folder = S3FolderName.DIARY;
  //     const fileName = `${diaryIdx}-${DateUtils.momentFile()}-${uuid.v4()}-${
  //       file.originalname
  //     }`;
  //     const fileKey = `${folder}/${fileName}`;
  //     const result = await asyncUploadToS3(fileKey, file.buffer);
  //     const image = new DiaryImage();
  //     image.diaryIdx = diary.idx;
  //     image.imagePath = result.Location;

  //     images.push(image);
  //   }
  //   await this.diaryImageRepository.save(images);

  //   diary.updateFromDto(dto);
  //   await this.diaryRepository.save(diary);

  //   return {
  //     ...diary,
  //     images: images.filter((image) => !image.deletedAt),
  //   };
  // }
  /**
   * 다이어리 수정
   * @param diaryIdx 다이어리 인덱스
   * @param dto UpdateDiaryDto
   * @returns
   */
  async updateDiary(
    diaryIdx: number,
    dto: UpdateDiaryDto,
    files: Array<Express.Multer.File>,
  ) {
    const diary = await this.diaryRepository.findOne({
      where: {
        idx: diaryIdx,
      },
      relations: ['images'],
    });

    if (!diary) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_DIARY);
    }

    if (files) {
      // 기존 이미지 삭제
      await this.deleteDiaryImages(diary.images);
      const images = await this.uploadDiaryImages(files, diaryIdx);
      diary.images = images;
    }

    diary.updateFromDto(dto);
    await this.diaryRepository.save(diary);

    return {
      ...diary,
      images: diary.images.filter((image) => !image.deletedAt),
    };
  }

  /**
   * 다이어리 삭제
   * @param diaryIdx 다이어리 인덱스
   */
  async removeDiary(diaryIdx: number) {
    const diary = await this.diaryRepository.findOne({
      where: {
        idx: diaryIdx,
      },
    });

    if (!diary) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_DIARY);
    }

    await this.diaryRepository.softDelete(diaryIdx);
  }

  /**
   * 다이어리 다중 이미지 업로드
   * @param files 파일들
   * @returns 이미지 엔티티
   */
  async uploadDiaryImages(
    files: Express.Multer.File[],
    diaryIdx: number,
  ): Promise<DiaryImage[]> {
    const images: DiaryImage[] = [];

    for (const file of files) {
      const url = await this.uploadImageToS3(file, S3FolderName.DIARY);
      const image = new DiaryImage();
      image.diaryIdx = diaryIdx;
      image.imagePath = url;
      images.push(image);
    }

    await this.diaryImageRepository.save(images);
    return images;
  }

  async deleteDiaryImages(images: DiaryImage[]): Promise<void> {
    for (const image of images) {
      await this.diaryImageRepository.softRemove(image);
    }
  }
}
