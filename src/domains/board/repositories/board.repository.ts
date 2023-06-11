import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Board } from '../entities/board.entity';
import { PageRequest } from 'src/core/page';

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
  findAndCountByCategory(
    pageRequest: PageRequest,
    category: string,
  ): Promise<[Board[], number]> {
    // const category = pageRequest.category;
    return this.createQueryBuilder('board')
      .leftJoinAndSelect('board.images', 'image')
      .where('board.category = :category', { category })
      .orderBy('board.idx', pageRequest.order)
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }
  findBoadDetailByBoardIdx(boardIdx: number): Promise<Board> {
    return this.createQueryBuilder('board')
      .leftJoinAndSelect('board.images', 'image')
      .where('board.idx = :boardIdx', { boardIdx })
      .getOne();
  }
}
