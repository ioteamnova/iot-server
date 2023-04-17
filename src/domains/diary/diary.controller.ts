import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import HttpResponse from 'src/core/http/http-response';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Controller('diaries')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @ApiOperation({
    summary: '반려동물 정보 등록',
    description: '다이어리를 작성할 반려동물의 정보를 등록한다.',
  })
  @ApiBody({ type: CreatePetDto })
  @Post('/pet')
  async createPet(@Res() res, @Body() dto: CreatePetDto) {
    const pet = await this.diaryService.createPet(dto);
    return HttpResponse.created(res, { body: { idx: pet } });
  }

  @Get()
  findAll() {
    return this.diaryService.findAll();
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
