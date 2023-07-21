import { Module } from '@nestjs/common';
import { IotBoardPersonalController } from './iot_board_personal.controller';
import { IotBoardPersonalService } from './iot_board_personal.service';
import { IotBoardPersonalRepository } from './repositories/iot-board-personal.repository';
import { IotNaturerecordRepository } from './repositories/iot-nature-record.repository';
import { IotControlrecordRepository } from './repositories/iot-control-record.repository';
import { IotAuthInfoRepository } from './repositories/iot-auth-info.repository';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      IotBoardPersonalRepository,
      IotNaturerecordRepository,
      IotControlrecordRepository,
      IotAuthInfoRepository,
    ]),
  ],
  controllers: [IotBoardPersonalController],
  providers: [IotBoardPersonalService],
})
export class IotPersonalModule {}
