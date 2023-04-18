import { PageRequest } from 'src/core/page';
import { Diary } from './../entities/diary.entity';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';

@CustomRepository(Diary)
export class DiaryRepository extends Repository<Diary> {
  findAndCountByPetIdx(
    petIdx: number,
    pageRequest: PageRequest,
  ): Promise<[Diary[], number]> {
    return this.createQueryBuilder('diary')
      .where('diary.petIdx = :petIdx', { petIdx })
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }
}
