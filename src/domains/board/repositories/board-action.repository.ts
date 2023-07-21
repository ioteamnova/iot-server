import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { BoardAction } from '../entities/board-action.entity';

@CustomRepository(BoardAction)
export class BoardActionRepository extends Repository<BoardAction> {
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
  // findBoardInfoByStreamKey(streamKey: string): Promise<BoardAction>{
  //   return this.createQueryBuilder('iotauth')
  //     .where({ streamKey: streamKey })
  //     .orderBy('idx', 'DESC')
  //     .getOne();
  // }
}
