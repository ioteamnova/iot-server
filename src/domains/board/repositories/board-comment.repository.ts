import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import BoardComment from '../entities/board-comment.entity';

@CustomRepository(BoardComment)
export class BoardCommentRepository extends Repository<BoardComment> {
  findAndCountByBoardIdx(
    pageRequest: PageRequest,
    boardIdx: number,
  ): Promise<[BoardComment[], number]> {
    return this.createQueryBuilder('comment')
      .where('comment.boardIdx = :boardIdx', { boardIdx })
      .orderBy('idx', pageRequest.order)
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }
  updateReplyCnt(commentIdx: number, replyCnt: number) {
    this.createQueryBuilder()
      .update(BoardComment)
      .set({ replyCnt })
      .where('idx = :commentIdx', { commentIdx })
      .execute();
  }
}
