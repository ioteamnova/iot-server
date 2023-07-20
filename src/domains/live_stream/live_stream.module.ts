import { Module } from '@nestjs/common';
import { LiveStreamController } from './live_stream.controller';
import { LiveStreamService } from './live_stream.service';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { LiveStreamRepository } from './repositories/live-stream.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([LiveStreamRepository])],
  controllers: [LiveStreamController],
  providers: [LiveStreamService],
})
export class LiveStreamModule {}
