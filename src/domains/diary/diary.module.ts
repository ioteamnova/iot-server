import { PetRepository } from './repositories/pet.repository';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([PetRepository])],
  controllers: [DiaryController],
  providers: [DiaryService],
  exports: [TypeOrmExModule],
})
export class DiaryModule {}
