import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import BoardReply from '../entities/board-reply.entity';

@CustomRepository(BoardReply)
export class BoardReplyRepository extends Repository<BoardReply> {
  findAndCountByBoardIdx(
    pageRequest: PageRequest,
    commentIdx: number,
  ): Promise<[BoardReply[], number]> {
    return this.createQueryBuilder('reply')
      .where('reply.commentIdx = :commentIdx', { commentIdx })
      .orderBy('idx', pageRequest.order)
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }
  findMyComment(
    pageRequest: PageRequest,
    userIdx: number,
  ): Promise<[BoardReply[], number]> {
    return this.createQueryBuilder('reply')
      .where('reply.userIdx = :userIdx', { userIdx })
      .orderBy('idx', pageRequest.order)
      .take(pageRequest.limit / 2)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }
}
