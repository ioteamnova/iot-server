import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { Boardcontroller } from './board.controller';
import { BoardService } from './board.service';
import { BoardRepository } from './repositories/board.repository';
import { BoardImageRepository } from './repositories/board-image.repository';
import { BoardReplyRepository } from './repositories/board-reply.repository';
import { BoardRereplyRepository } from './repositories/board-rereply.repository';
import { BoardBookmarkRepository } from './repositories/board-bookmark.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BoardRepository,
      BoardImageRepository,
      BoardReplyRepository,
      BoardRereplyRepository,
      BoardBookmarkRepository,
    ]),
  ],
  controllers: [Boardcontroller],
  providers: [BoardService],
  exports: [BoardService, TypeOrmExModule],
})
export class BoardModule {}
