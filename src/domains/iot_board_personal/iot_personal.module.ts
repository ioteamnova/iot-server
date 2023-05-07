import { Module } from '@nestjs/common';
import { IotPersonalController } from './iot_personal.controller';
import { IotPersonalService } from './iot_personal.service';
import { Iot_board_personal } from './entities/iot_board_personal.entity';
import { IotBoardPersonalRepository } from './repositories/iot_board_personal.repository';
import { IotNaturerecordRepository } from './repositories/iot_nature_record.repository';
import { IotControlrecordRepository } from './repositories/iot_control_record.repository';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([IotBoardPersonalRepository,IotNaturerecordRepository,IotControlrecordRepository]),
    TypeOrmModule.forFeature(
        [IotBoardPersonalRepository],
    )
],
  controllers: [IotPersonalController],
  providers: [IotPersonalService]
})
export class IotPersonalModule {}
