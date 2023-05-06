import { Module } from '@nestjs/common';
import { IotPersonalController } from './iot_personal.controller';
import { IotPersonalService } from './iot_personal.service';
import { Iot_personal } from './entities/iot_personal.entity';
import { IotPersonalRepository } from './repositories/iot_personal.repository';
import { IotNaturerecordRepository } from './repositories/iot_naturerecord.repository';
import { IotControlrecordRepository } from './repositories/iot_controlrecord.repository';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([IotPersonalRepository,IotNaturerecordRepository,IotControlrecordRepository]),
    TypeOrmModule.forFeature(
        [IotPersonalRepository],
    )
],
  controllers: [IotPersonalController],
  providers: [IotPersonalService]
})
export class IotPersonalModule {}
