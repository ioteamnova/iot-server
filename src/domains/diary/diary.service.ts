import { DiaryListDto } from './dtos/diary-list.dto';
import { DiaryRepository } from './repositories/diary.repository';
import { UpdatePetDto } from './dtos/pet-update.dto';
import { PetRepository } from './repositories/pet.repository';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { CreatePetWeightDto } from './dtos/create-pet-weight.dto';
import { PetWeight } from './entities/pet-weight.entity';
import { PetWeightRepository } from './repositories/pet-weight.repository';
import { PetWeightListDto } from './dtos/pet-weight-list.dto';
import { UpdatePetWeightDto } from './dtos/update-pet-weight.dto';
import { PetWeightPageRequest } from './dtos/pet-weight-page';
import { PetListDto } from './dtos/pet-list.dto';
import { UserRepository } from '../user/repositories/user.repository';


@Injectable()
export class DiaryService {
  constructor(
    private userRepository: UserRepository,
    private petRepository: PetRepository,
    private diaryRepository: DiaryRepository,
    private diaryImageRepository: DiaryImageRepository,
    private petWeightRepository: PetWeightRepository,
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
  async findAllPets(
    userIdx: number,
    pageRequest: PageRequest,
  ): Promise<Page<PetListDto>> {
    const user = await this.userRepository.findByUserIdx(userIdx);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    const [pets, totalCount] = await this.petRepository.findAndCountByUserIdx(
      userIdx,
      pageRequest,
    );

    const items = pets.map((pet: Pet) => new PetListDto(pet));
    return new Page<PetListDto>(totalCount, items, pageRequest);
  }

  /**
   * 반려동물 정보 수정
   * @param petIdx 반려동물 인덱스
   * @param dto UpdatePetDto
   * @param file 이미지 파일
   * @returns 반려동물 정보
   */
  async updatePet(
    petIdx: number,
    dto: UpdatePetDto,
    file: Express.Multer.File,
  ) {
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

    // 펫 존재여부 확인
    const pet = await this.petRepository.findByPetIdx(petIdx);
    if (!pet) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_PET);
    }

    // 다이어리 엔티티 생성해서 DB에 추가
    const diary = Diary.from(dto);
    diary.petIdx = petIdx;
    await this.diaryRepository.save(diary);

    if (files) {
      const images = await this.uploadDiaryImages(files, diary.idx);
      diary.images = images;
    }
    
    return diary

    // return {
    //   ...diary,
    //   images: diary.images,
    // };
    
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
      relations: ['images'],
    });

    if (!diary) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_DIARY);
    }
    // 다이어리 이미지 같이 삭제
    if (diary.images) {
      await this.deleteDiaryImages(diary.images);
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

  /**
   * 반려동물 체중 등록
   * @param petIdx 펫 인덱스
   * @param dto CreatePetWeightDto
   * @returns 등록한 정보
   */
  async createPetWeight(petIdx: number, dto: CreatePetWeightDto) {
    const pet = await this.petRepository.findByPetIdx(petIdx);
    if (!pet) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_PET);
    }
    const existDate = await this.petWeightRepository.checkExistDate(
      pet.idx,
      dto.date,
    );
    if (existDate) {
      throw new ConflictException(HttpErrorConstants.EXIST_DATE);
    }

    const weight = PetWeight.from(dto);
    weight.petIdx = petIdx;
    const result = await this.petWeightRepository.save(weight);
    return result;
  }

  /**
   * 반려동물 체중 목록 조회
   * 목록 조회 API는 쿼리파라미터의 필터로 필요한 부분을 프론트에서 사용한다.
   * default는 일반적인 목록 조회 페이징 리턴
   * week: 현재 날짜로부터 7일 이내의 데이터 리턴
   * month: 현재 날짜로부터 30일 이내의 데이터 리턴 (최대 30개)
   * year: 현재 날짜로부터 1년 이내의 데이터 중, 월별 평균값을 리턴
   *
   * @param petIdx 펫 인덱스
   * @param pageRequest 페이징 객체
   * @returns 위의 주석 참고
   */
  async findPetWeights(petIdx: number, pageRequest: PetWeightPageRequest) {
    const pet = await this.petRepository.findByPetIdx(petIdx);
    if (!pet) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_PET);
    }

    if (pageRequest.filter === 'year') {
      const result = await this.petWeightRepository.getMonthlyAverageInYear(
        petIdx,
      );
      return result;
    }
    const [weights, totalCount] =
      await this.petWeightRepository.findAndCountByPetIdx(petIdx, pageRequest);
      
    const items = weights.map((weight, index) => {
      const prevWeight = weights[index + 1]?.weight;
      const weightChange = prevWeight ? weight.weight - prevWeight : 0;
      return new PetWeightListDto(weight, weightChange);
    });
    return new Page<PetWeightListDto>(totalCount, items, pageRequest);
  }

  /**
   * 반려동물 체중 정보 수정
   * @param weightIdx 체중 인덱스
   * @param dto UpdatePetWeightDto
   * @returns 수정된 객체
   */
  async updatePetWeight(weightIdx: number, dto: UpdatePetWeightDto) {
    const petWeight = await this.petWeightRepository.findOne({
      where: {
        idx: weightIdx,
      },
    });
    if (!petWeight) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_WEIGHT);
    }

    // dto.date가 없으면 date는 그대로이므로, 체중값만 바꿔주면 됨.
    if (dto.date) {
      const existDate = await this.petWeightRepository.checkExistDate(
        petWeight.petIdx,
        dto.date,
      );
      if (existDate) {
        throw new ConflictException(HttpErrorConstants.EXIST_DATE);
      }
    }

    petWeight.updateFromDto(dto);

    const result = await this.petWeightRepository.save(petWeight);
    return result;
  }

  /**
   * 반려동물 체중 정보 삭제
   * @param weightIdx 체중 인덱스
   */
  async removePetWeight(weightIdx: number) {
    const petWeight = await this.petWeightRepository.findOne({
      where: {
        idx: weightIdx,
      },
    });
    if (!petWeight) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_WEIGHT);
    }
    await this.petWeightRepository.softDelete(petWeight.idx);
  }
}
