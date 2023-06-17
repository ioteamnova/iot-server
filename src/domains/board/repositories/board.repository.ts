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
  async findBoadDetailByBoardIdx(boardIdx: number): Promise<BoardListDto> {
    const board = await this.createQueryBuilder('board')
      .leftJoinAndSelect('board.images', 'image')
      .where('board.idx = :boardIdx', { boardIdx })
      .getOne();
    const boardListDto = BoardListDto.from(board);
    return boardListDto;
  }
  updateReplyCnt(boardIdx: number, commentCnt: number) {
    console.log('boardIdx', boardIdx);
    this.createQueryBuilder()
      .update(Board)
      .set({ commentCnt })
      .where('board.idx = :boardIdx', { boardIdx })
      .execute();
  }
}
