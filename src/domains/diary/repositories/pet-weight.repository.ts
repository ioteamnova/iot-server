import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { PetWeightPageRequest } from '../dtos/pet-weight-page';
import { PetWeight } from '../entities/pet-weight.entity';

@CustomRepository(PetWeight)
export class PetWeightRepository extends Repository<PetWeight> {
  async checkExistDate(petIdx: number, date: Date): Promise<boolean> {
    const existDate = await this.exist({
      where: {
        petIdx,
        date,
      },
    });
    return existDate;
  }

  async findAndCountByPetIdx(
    petIdx: number,
    pageRequest: PetWeightPageRequest,
  ): Promise<[PetWeight[], number]> {
    const queryBuilder = this.createQueryBuilder('petWeight').where(
      'petWeight.petIdx = :petIdx',
      { petIdx },
    );

    switch (pageRequest.filter) {
      case 'week':
        return queryBuilder
          .andWhere('petWeight.date >= DATE_SUB(NOW(), INTERVAL 7 DAY)')
          .orderBy('petWeight.date', 'ASC')
          .getManyAndCount();

      case 'month':
        //현재 날짜로부터 30일이내의 데이터 최대 30개
        return queryBuilder
          .andWhere('petWeight.date >= DATE_SUB(NOW(), INTERVAL 30 DAY)')
          .orderBy('petWeight.date', 'ASC')
          .take(30)
          .getManyAndCount();

      case 'default':
        // 기본 페이징과 동일
        return queryBuilder
          .orderBy('petWeight.date', pageRequest.order)
          .take(pageRequest.limit)
          .skip(pageRequest.offset)
          .getManyAndCount();
    }
  }

  // 현재날짜로부터 일년이내의 데이터를 월별 몸무게 평균값 구하는 함수
  getMonthlyAverageInYear(petIdx: number) {
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
