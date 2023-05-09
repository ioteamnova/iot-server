import { Module } from '@nestjs/common';
import { IotPersonalController } from './iot_board_personal.controller';
import { IotPersonalService } from './iot_board_personal.service';
import { IotBoardPersonalRepository } from './repositories/iot-board-personal.repository';
import { IotNaturerecordRepository } from './repositories/iot-nature-record.repository';
import { IotControlrecordRepository } from './repositories/iot-control-record.repository';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      IotBoardPersonalRepository,
      IotNaturerecordRepository,
      IotControlrecordRepository,
    ]),
  ],
  controllers: [IotPersonalController],
  providers: [IotPersonalService],
})
export class IotPersonalModule { }
