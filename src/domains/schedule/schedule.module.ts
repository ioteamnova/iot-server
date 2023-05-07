import { ScheduleRepository } from './repositories/schedule.repository';
import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ScheduleRepository])],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [TypeOrmExModule],
})
export class ScheduleModule {}
