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
import { BoardAuctionRepository } from './repositories/board-auction.repository';
import { LiveStreamRepository } from '../live_stream/repositories/live-stream.repository';
import { ClientRecommend } from '../../utils/client-recommend';
import { BoardElasticSearch } from './providers/elastic-search';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BoardRepository,
      BoardImageRepository,
      BoardReplyRepository,
      BoardCommentRepository,
      BoardBookmarkRepository,
      BoardCommercialRepository,
      BoardAuctionRepository,
      UserRepository,
      LiveStreamRepository,
    ]),
    ElasticsearchModule.register({
      node: process.env.ELASICSEARCH_HOST, // Elasticsearch 서버 주소
    }),
  ],
  controllers: [Boardcontroller],
  providers: [BoardService, ClientRecommend, BoardElasticSearch],
  exports: [BoardService, TypeOrmExModule],
})
export class BoardModule {}
