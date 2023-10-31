import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { MoffList } from '../entities/moff-list.entity';

@CustomRepository(MoffList)
export class MoffListRepository extends Repository<MoffList> {}
