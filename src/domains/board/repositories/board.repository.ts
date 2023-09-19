import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Board } from '../entities/board.entity';
import { BoardListDto } from '../dtos/board-list.dto';
import { BoardCategoryPageRequest } from '../dtos/board-category-page';
import { PageRequest } from 'src/core/page';

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
  async findAndCountByCategory(
    pageRequest: BoardCategoryPageRequest,
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
      .orderBy('image.mediaSequence', 'ASC') // sequence 컬럼을 내림차순으로 정렬
      .getOne();
    const boardListDto = BoardListDto.from(board);
    return boardListDto;
  }
  updateReplyCnt(boardIdx: number, commentCnt: number) {
    this.createQueryBuilder()
      .update(Board)
      .set({ commentCnt })
      .where('board.idx = :boardIdx', { boardIdx })
      .execute();
  }
  async updateViewCount(boardIdx: number, view: number): Promise<void> {
    await this.createQueryBuilder()
      .update(Board)
      .set({ view })
      .where('board.idx = :boardIdx', { boardIdx })
      .execute();
  }
  async findAndCountByCategoryMyPage(
    pageRequest: BoardCategoryPageRequest,
    userIdx: number,
  ): Promise<[BoardListDto[], number]> {
    const [boards, totalCount] = await this.createQueryBuilder('board')
      .leftJoinAndSelect('board.images', 'image')
      .where('board.category <> :category', { category: 'auction' })
      .andWhere('board.userIdx = :userIdx', { userIdx })
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
  async findAndCountByAuctionMyPage(
    pageRequest: BoardCategoryPageRequest,
    userIdx: number,
  ): Promise<[BoardListDto[], number]> {
    const [boards, totalCount] = await this.createQueryBuilder('board')
      .leftJoinAndSelect('board.images', 'image')
      .where('board.category = :category', { category: 'auction' })
      .andWhere('board.userIdx = :userIdx', { userIdx })
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
  async findAndCountByUserIdx(
    userIdx: number,
    pageRequest: PageRequest,
  ): Promise<[BoardListDto[], number]> {
    const [boards, totalCount] = await this.createQueryBuilder('board')
      .where('board.userIdx = :userIdx', { userIdx })
      .andWhere('board.category != :category', { category: 'auction' })
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
}
