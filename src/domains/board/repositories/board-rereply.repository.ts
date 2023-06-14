import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import BoardRereply from '../entities/board-rereply.entity';

@CustomRepository(BoardRereply)
export class BoardRereplyRepository extends Repository<BoardRereply> {
  findAndCountByBoardIdx(
    pageRequest: PageRequest,
    replyIdx: number,
  ): Promise<[BoardRereply[], number]> {
    console.log(replyIdx);
    return this.createQueryBuilder('Rereply')
      .where('Rereply.replyIdx = :replyIdx', { replyIdx })
      .orderBy('idx', pageRequest.order)
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }
}
