import { Repository } from 'typeorm';
import { PageRequest } from 'src/core/page';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Board } from '../entities/board.entity';
import { BoardInfoDto } from '../dtos/boardInfo.dto';

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {}
