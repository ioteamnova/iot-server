import { Pet } from 'src/domains/diary/entities/pet.entity';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { PageRequest } from 'src/core/page';

@CustomRepository(Pet)
export class PetRepository extends Repository<Pet> {
  findAndCountByUserIdx(userIdx: number, pageRequest: PageRequest) {
    return this.createQueryBuilder('pet')
      .where('pet.userIdx = :userIdx', { userIdx })
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }
}
