import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import { Repository } from 'typeorm';
import { PetWeight } from '../entities/pet-weight.entity';

@CustomRepository(PetWeight)
export class PetWeightRepository extends Repository<PetWeight> {
  findAndCountByPetIdx(
    petIdx: number,
    pageRequest: PageRequest,
  ): Promise<[PetWeight[], number]> {
    return this.createQueryBuilder('petWeight')
      .where('petWeight.petIdx = :petIdx', { petIdx })
      .orderBy('petWeight.idx', 'DESC')
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }
}
