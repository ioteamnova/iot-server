import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import BoardReply from '../entities/board-reply.entity';
import { BoardCommercial } from '../entities/board-commercial.entity';

@CustomRepository(BoardCommercial)
export class BoardCommercialRepository extends Repository<BoardCommercial> {
  // findAndCountByBoardIdx(
  //   pageRequest: PageRequest,
  //   boardIdx: number,
  // ): Promise<[BoardReply[], number]> {
  //   return this.createQueryBuilder('Reply')
  //     .where('Reply.boardIdx = :boardIdx', { boardIdx })
  //     .orderBy('idx', pageRequest.order)
  //     .take(pageRequest.limit)
  //     .skip(pageRequest.offset)
  //     .getManyAndCount();
  // }
}
