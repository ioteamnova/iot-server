import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { BoardImage } from '../entities/board-image.entity';

@CustomRepository(BoardImage)
export class BoardImageRepository extends Repository<BoardImage> {}
