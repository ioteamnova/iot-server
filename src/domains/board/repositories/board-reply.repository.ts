import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import BoardReply from '../entities/board-reply.entity';

@CustomRepository(BoardReply)
export class BoardReplyRepository extends Repository<BoardReply> {
  findAndCountByBoardIdx(
    pageRequest: PageRequest,
    boardIdx: number,
  ): Promise<[BoardReply[], number]> {
    return this.createQueryBuilder('Reply')
      .where('Reply.boardIdx = :boardIdx', { boardIdx })
      .orderBy('idx', pageRequest.order)
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }
}
