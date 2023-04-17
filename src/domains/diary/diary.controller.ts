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
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import AuthUser from 'src/core/decorators/auth-user.decorator';
import HttpResponse from 'src/core/http/http-response';
import UseAuthGuards from '../auth/auth-guards/use-auth';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { PetListDto } from './dto/pet-response.dto';
import { SwaggerTag } from 'src/core/swagger/swagger-tags';
import { Page, PageRequest } from 'src/core/page';

@ApiTags(SwaggerTag.DIARY)
@Controller('diaries')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @ApiOperation({
    summary: '반려동물 정보 등록',
    description: '다이어리를 작성할 반려동물의 정보를 등록한다.',
  })
  @ApiBody({ type: CreatePetDto })
  @UseAuthGuards()
  @Post('/pet')
  async createPet(
    @Res() res,
    @Body() dto: CreatePetDto,
    @AuthUser() user: User,
  ) {
    const pet = await this.diaryService.createPet(dto, user.idx);
    return HttpResponse.created(res, { body: { idx: pet } });
  }

  @ApiOperation({
    summary: '반려동물 목록 조회',
    description: '유저가 등록한 반려동물의 목록을 조회한다.',
  })
  @ApiOkResponse({ type: PetListDto, isArray: true })
  @UseAuthGuards()
  @Get('/pet')
  async findAll(
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diaryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiaryDto: UpdateDiaryDto) {
    return this.diaryService.update(+id, updateDiaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diaryService.remove(+id);
  }
}
