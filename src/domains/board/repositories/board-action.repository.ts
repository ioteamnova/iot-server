import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { BoardAction } from '../entities/board-action.entity';

@CustomRepository(BoardAction)
export class BoardActionRepository extends Repository<BoardAction> {
  // findAndCountByBoardStreamKey(
  //   streamKey: string,
  //   // pageRequest: PageRequest,
  // ): Promise<[BoardAction[], number]> {
  //   return (
  //     this.createQueryBuilder('boardAction')
  //       .leftJoinAndSelect('boardAction.boardIdx', 'boardIdx')
  //       .where('boardAction.boardIdx = :idx', { streamKey })
  //       // .orderBy('diary.idx', pageRequest.order)
  //       // .take(pageRequest.limit)
  //       // .skip(pageRequest.offset)
  //       .getManyAndCount()
  //   );
  // }
}
