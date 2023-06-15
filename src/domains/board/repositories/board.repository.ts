import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Board } from '../entities/board.entity';
import { PageRequest } from 'src/core/page';
import { BoardListDto } from '../dtos/board-list.dto';

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
  async findAndCountByCategory(
    pageRequest: PageRequest,
    category: string,
  ): Promise<[BoardListDto[], number]> {
    const [boards, totalCount] = await this.createQueryBuilder('board')
      .leftJoinAndSelect('board.images', 'image')
      .where('board.category = :category', { category })
      .orderBy('board.idx', pageRequest.order)
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();

    const boardListDtoArr: BoardListDto[] = await boards.map((board) => {
      const boardListDto = BoardListDto.from(board);
      return boardListDto;
    });
    return [boardListDtoArr, totalCount];
  }
  findBoadDetailByBoardIdx(boardIdx: number): Promise<Board> {
    return this.createQueryBuilder('board')
      .leftJoinAndSelect('board.images', 'image')
      .where('board.idx = :boardIdx', { boardIdx })
      .getOne();
  }
  updateReplyCnt(boardIdx: number, replyCnt: number) {
    this.createQueryBuilder()
      .update(Board)
      .set({ replyCnt })
      .where('board.idx = :boardIdx', { boardIdx })
      .execute();
  }
}
