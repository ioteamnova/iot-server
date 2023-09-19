import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MypageService } from './mypage.service';
import { Mypagecontroller } from './mypage.controller';
import { BoardRepository } from '../board/repositories/board.repository';
import { BoardCommercialRepository } from '../board/repositories/board-commercial.repository';
import { BoardAuctionRepository } from '../board/repositories/board-auction.repository';
import { BoardCommentRepository } from '../board/repositories/board-comment.repository';
import { BoardReplyRepository } from '../board/repositories/board-reply.repository';
import { ChatConversationRepository } from './repositories/chat-conversation.repository';
import { BoardBookmarkRepository } from '../board/repositories/board-bookmark.repository';
@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BoardRepository,
      BoardCommercialRepository,
      BoardAuctionRepository,
      BoardReplyRepository,
      ChatConversationRepository,
      BoardBookmarkRepository,
    ]),
    RedisModule.forRoot({
      readyLog: true,
      config: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [Mypagecontroller],
  providers: [MypageService, BoardCommentRepository],
  exports: [MypageService, TypeOrmExModule],
})
export class MypageModule {}