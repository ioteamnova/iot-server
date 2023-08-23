import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { BoardCommercial } from '../entities/board-commercial.entity';

@CustomRepository(BoardCommercial)
export class BoardCommercialRepository extends Repository<BoardCommercial> {}
