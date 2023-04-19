import { DiaryRepository } from './repositories/diary.repository';
import { PetRepository } from './repositories/pet.repository';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([PetRepository, DiaryRepository]),
  ],
  controllers: [DiaryController],
  providers: [DiaryService],
  exports: [DiaryService, TypeOrmExModule],
})
export class DiaryModule {}
