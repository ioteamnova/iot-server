import { DiaryDetailDto } from './dtos/diary-detail-dto';
import { UpdatePetDto } from './dtos/pet-update.dto';
import { Pet } from 'src/domains/diary/entities/pet.entity';
import { User } from 'src/domains/user/entities/user.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import AuthUser from 'src/core/decorators/auth-user.decorator';
import HttpResponse from 'src/core/http/http-response';
import UseAuthGuards from '../auth/auth-guards/use-auth';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dtos/create-diary.dto';
import { CreatePetDto } from './dtos/create-pet.dto';
import { UpdateDiaryDto } from './dtos/update-diary.dto';
import { PetListDto } from './dtos/pet-list.dto';
import { SwaggerTag } from 'src/core/swagger/swagger-tags';
import { Page, PageRequest } from 'src/core/page';
import { ApiOkResponseTemplate } from 'src/core/swagger/api-ok-response';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { DiaryListDto } from './dtos/diary-list.dto';
import { ApiCreatedResponseTemplate } from 'src/core/swagger/api-created-response';
import { ApiCommonErrorResponseTemplate } from 'src/core/swagger/api-error-common-response';
import { PetResponseDto } from './dtos/pet-response.dto';
import { ApiErrorResponseTemplate } from 'src/core/swagger/apt-error-response';
import { StatusCodes } from 'http-status-codes';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { ApiOkPaginationResponseTemplate } from 'src/core/swagger/api-ok-pagination-response';

@ApiTags(SwaggerTag.DIARY)
@ApiCommonErrorResponseTemplate()
@Controller('/diaries')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @ApiOperation({
    summary: '반려동물 정보 등록',
    description: '다이어리를 작성할 반려동물의 정보를 등록한다.',
  })
  @ApiBody({ type: CreatePetDto })
  @ApiCreatedResponseTemplate({ type: PetResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  @UseAuthGuards()
  @Post('/pet')
  async createPet(
    @Res() res,
    @Body() dto: CreatePetDto,
    @AuthUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const pet = await this.diaryService.createPet(dto, user.idx, file);
    return HttpResponse.created(res, { body: pet });
  }

  @ApiOperation({
    summary: '반려동물 목록 조회',
    description: '다이어리를 작성할 반려동물의 목록을 조회한다.',
  })
  @ApiOkPaginationResponseTemplate({ type: PetListDto })
  @UseAuthGuards()
  @Get('/pet')
  async findAllPets(
    @Res() res,
    @AuthUser() user: User,
    @Query() pageRequest: PageRequest,
  ) {
    const [pets, totalCount] = await this.diaryService.findAll(
      user.idx,
      pageRequest,
    );
    const items = pets.map((pet: Pet) => new PetListDto(pet));
    const result = new Page<PetListDto>(totalCount, items, pageRequest);
    return HttpResponse.ok(res, result);
  }

  @ApiOperation({
    summary: '반려동물 정보 수정',
    description: '반려동물의 정보를 수정한다.',
  })
  @ApiOkResponseTemplate({ type: UpdatePetDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_PET],
    },
  ])
  @UseInterceptors(FileInterceptor('file'))
  @UseAuthGuards()
  @Patch('/pet/:petIdx')
  async updatePet(
    @Res() res,
    @Param('petIdx') petIdx: number,
    @Body() dto: UpdatePetDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const pet = await this.diaryService.update(petIdx, dto, file);
    return HttpResponse.ok(res, pet);
  }

  @ApiOperation({
    summary: '반려동물 정보 삭제',
    description: '반려동물 정보를 삭제한다. ',
  })
  @ApiOkResponseTemplate()
  @UseAuthGuards()
  @Delete('/pet/:petIdx')
  async removePet(@Res() res, @Param('petIdx') petIdx: number) {
    await this.diaryService.removePet(petIdx);
    return HttpResponse.ok(res);
  }

  @ApiOperation({
    summary: '다이어리 등록',
    description: '선택한 반려동물의 다이어리를 등록한다.',
  })
  @ApiCreatedResponseTemplate({})
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_PET],
    },
  ])
  @ApiBody({ type: CreateDiaryDto })
  @UseAuthGuards()
  @UseInterceptors(FilesInterceptor('files', 5))
  @Post('/:petIdx')
  async createDiary(
    @Res() res,
    @Param('petIdx') petIdx: number,
    @Body() dto: CreateDiaryDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const diary = await this.diaryService.createDiary(petIdx, dto, files);
    return HttpResponse.created(res, { body: diary });
  }

  @ApiOperation({
    summary: '다이어리 목록 조회',
    description: '선택한 반려동물의 다이어리 목록을 조회한다.',
  })
  @ApiOkPaginationResponseTemplate({ type: DiaryListDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_PET],
    },
  ])
  @UseAuthGuards()
  @Get('/:petIdx')
  async findAllDiaries(
    @Res() res,
    @Param('petIdx') petIdx: number,
    @Query() pageRequest: PageRequest,
  ) {
    const diaries = await this.diaryService.findAllDiaries(petIdx, pageRequest);
    return HttpResponse.ok(res, diaries);
  }

  @ApiOperation({
    summary: '다이어리 수정',
    description: '다이어리를 수정한다.',
  })
  @ApiOkResponseTemplate({ type: DiaryDetailDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_DIARY],
    },
  ])
  @UseAuthGuards()
  @Patch('/:diaryIdx')
  async updateDiary(
    @Res() res,
    @Param('diaryIdx') diaryIdx: number,
    @Body() dto: UpdateDiaryDto,
  ) {
    const diary = await this.diaryService.updateDiary(diaryIdx, dto);
    return HttpResponse.ok(res, diary);
  }

  @ApiOperation({
    summary: '다이어리 삭제',
    description: '다이어리를 삭제한다. ',
  })
  @ApiOkResponseTemplate()
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_DIARY],
    },
  ])
  @UseAuthGuards()
  @Delete('/:diaryIdx')
  async removeDiary(@Res() res, @Param('diaryIdx') diaryIdx: number) {
    await this.diaryService.removeDiary(diaryIdx);
    return HttpResponse.ok(res);
  }
}
