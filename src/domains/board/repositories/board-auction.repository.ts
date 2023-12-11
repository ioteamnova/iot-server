import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { BoardAuction } from '../entities/board-auction.entity';
import { BoardCategoryPageRequest } from '../dtos/board-category-page';
import { BoardListDto } from '../dtos/board-list.dto';

@CustomRepository(BoardAuction)
export class BoardAuctionRepository extends Repository<BoardAuction> {
  async findAndCountByState(
    pageRequest: BoardCategoryPageRequest,
    state: string,
  ): Promise<[BoardListDto[], number]> {
    const [auctions, totalCount] = await this.createQueryBuilder('boardAuction')
      .leftJoinAndSelect('boardAuction.board', 'board')
      .leftJoinAndSelect('board.user', 'user')
      .where('boardAuction.state = :state', { state })
      .orderBy('boardAuction.idx', pageRequest.order)
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();

    const auctionListDtoArr: BoardListDto[] = await auctions.map((auction) => {
      const boardListDto = BoardListDto.from(auction.board);
      boardListDto.UserInfo = auction.board.user;
      auction.board = null;
      boardListDto.boardAuction = auction;
      return boardListDto;
    });
    return [auctionListDtoArr, totalCount];
  }
}
