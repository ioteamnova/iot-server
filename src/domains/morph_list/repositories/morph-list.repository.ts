import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { MorphList } from '../entities/morph-list.entity';

@CustomRepository(MorphList)
export class MorphListRepository extends Repository<MorphList> {}
