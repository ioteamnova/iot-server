import { Module } from '@nestjs/common';
import { LiveStreamController } from './live_stream_record.controller';
import { LiveStreamService } from './live_stream_record.service';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { LiveStreamRepository } from './repositories/live-stream-record.repository';
import { BoardActionRepository } from '../board/repositories/board-action.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      LiveStreamRepository,
      BoardActionRepository,
    ]),
  ],
  controllers: [LiveStreamController],
  providers: [LiveStreamService],
})
export class LiveStreamModule {}
