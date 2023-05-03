import { Module } from '@nestjs/common';
import { IotPersonalController } from './iot_personal.controller';
import { IotPersonalService } from './iot_personal.service';

@Module({
  controllers: [IotPersonalController],
  providers: [IotPersonalService]
})
export class IotPersonalModule {}
