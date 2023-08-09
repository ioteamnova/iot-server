import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { BoardAuction } from '../entities/board-auction.entity';

@CustomRepository(BoardAuction)
export class BoardAuctionRepository extends Repository<BoardAuction> {}
