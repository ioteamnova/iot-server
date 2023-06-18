import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Bookmark } from '../entities/board-bookmark.entity';

@CustomRepository(Bookmark)
export class BoardBookmarkRepository extends Repository<Bookmark> {}
