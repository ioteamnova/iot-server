import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import { Repository } from 'typeorm';
import { PetWeightListDto } from '../dtos/pet-weight-list.dto';
import { PetWeightPageRequest } from '../dtos/pet-weight-page';
import { PetWeight } from '../entities/pet-weight.entity';

@CustomRepository(PetWeight)
export class PetWeightRepository extends Repository<PetWeight> {
  async checkExistDate(petIdx: number, date: Date): Promise<boolean> {
    const isDate = await this.exist({
      where: {
        petIdx,
        date,
      },
    });
    return isDate;
  }

  async findAndCountByPetIdx(
    petIdx: number,
    pageRequest: PetWeightPageRequest,
  ) {
    const queryBuilder = this.createQueryBuilder('petWeight').where(
      'petWeight.petIdx = :petIdx',
      { petIdx },
    );

    switch (pageRequest.filter) {
      case 'week':
        // 현재 날짜로부터 7일이내의 데이터
        queryBuilder.andWhere(
          'petWeight.date >= DATE_SUB(NOW(), INTERVAL 7 DAY)',
        );
        break;
      case 'month':
        //현재 날짜로부터 30일이내의 데이터 최대 30개
        queryBuilder.andWhere(
          'petWeight.date >= DATE_SUB(NOW(), INTERVAL 30 DAY)',
        );

        break;
      default:
        // 현재 날짜로부터 date 최근순
        break;
    }

    queryBuilder
      .orderBy('petWeight.date', 'DESC')
      .addOrderBy('petWeight.idx', 'DESC');

    return queryBuilder
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
  }

  // 현재날짜로부터 일년이내의 데이터를 월별 몸무게 평균값 구하는 함수
  getAverageByPetIdx(petIdx: number) {
    const queryBuilder = this.createQueryBuilder('petWeight')
      .where('petWeight.petIdx = :petIdx', { petIdx })
      .select('MONTH(petWeight.date)', 'month')
      .addSelect('AVG(petWeight.weight)', 'average')
      .andWhere('petWeight.date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)')
      .groupBy('MONTH(petWeight.date)')
      .getRawMany();

    return queryBuilder;
  }
}
