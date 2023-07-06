import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { Boardcontroller } from './board.controller';
import { BoardService } from './board.service';
import { BoardRepository } from './repositories/board.repository';
import { BoardImageRepository } from './repositories/board-image.repository';
import { BoardCommentRepository } from './repositories/board-comment.repository';
import { BoardReplyRepository } from './repositories/board-reply.repository';
import { BoardBookmarkRepository } from './repositories/board-bookmark.repository';
import { BoardCommercialRepository } from './repositories/board-commercial.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { RedisModule } from '@liaoliaots/nestjs-redis';
@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BoardRepository,
      BoardImageRepository,
      BoardReplyRepository,
      BoardCommentRepository,
      BoardBookmarkRepository,
      BoardCommercialRepository,
      UserRepository,
    ]),
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [Boardcontroller],
  providers: [BoardService],
  exports: [BoardService, TypeOrmExModule],
})
export class BoardModule {}
