import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Board } from '../entities/board.entity';
import { BoardListDto } from '../dtos/board-list.dto';
import { BoardCategoryPageRequest } from '../dtos/board-category-page';
import { PageRequest } from 'src/core/page';
import {
  BoardVerifyType,
  BoardOrderCriteria,
} from '../../user/helper/constant';

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
  async findAndCountByCategory(
    pageRequest: BoardCategoryPageRequest,
    category: string,
    orderCriteria: string,
  ): Promise<[BoardListDto[], number]> {
    let orderByField;

    // 정렬기준을 DB가 이해할수 있는 필드(컬럼)네임 형태로 바꾼다
    switch (orderCriteria) {
      case BoardOrderCriteria.CREATED:
        orderByField = 'board.idx';
        break;

      case BoardOrderCriteria.VIEW:
        orderByField = 'board.view';
        break;

      // 가격 정렬은, MARKET, AUCTION, ADOPTION 게시글에 대해서만 적용한다
      case BoardOrderCriteria.PRICE:
        switch (category) {
          case BoardVerifyType.MARKET:
          case BoardVerifyType.ADOPTION:
            orderByField = 'commercial.price';
            break;
          case BoardVerifyType.AUCTION:
            orderByField = 'auction.currentPrice';
            break;
        }
        break;
    }

    const [boards, totalCount] = await this.createQueryBuilder('board')
      .leftJoinAndSelect(
        'board_auction',
        'auction',
        'board.idx = auction.boardIdx',
      )
      .leftJoinAndSelect(
        'board_commercial',
        'commercial',
        'board.idx = commercial.boardIdx')
      .where('board.category = :category', { category })
      .andWhere(category === 'auction' ? 'auction.state <> :state' : '1=1', { state: 'temp' })
      .orderBy(orderByField, pageRequest.order)
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
