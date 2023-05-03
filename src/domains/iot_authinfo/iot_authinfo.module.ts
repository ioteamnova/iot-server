import { Module } from '@nestjs/common';
import { IotAuthinfoController } from './iot_authinfo.controller';
import { IotAuthinfoService } from './iot_authinfo.service';

@Module({
  controllers: [IotAuthinfoController],
  providers: [IotAuthinfoService]
})
export class IotAuthinfoModule {}
