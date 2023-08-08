import { Module } from '@nestjs/common';
import { LiveStreamController } from './live_stream.controller';
import { LiveStreamService } from './live_stream.service';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { LiveStreamRepository } from './repositories/live-stream.repository';
import { BoardAuctionRepository } from '../board/repositories/board-auction.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      LiveStreamRepository,
      BoardAuctionRepository,
    ]),
  ],
  controllers: [LiveStreamController],
  providers: [LiveStreamService],
})
export class LiveStreamModule {}
