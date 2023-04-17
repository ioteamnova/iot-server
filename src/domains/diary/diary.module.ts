import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';

@Module({
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}
