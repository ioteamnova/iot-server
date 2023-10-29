import { Injectable } from '@nestjs/common';
import { MoffListRepository } from './repositories/moff-list.repository';

@Injectable()
export class MoffListService {
  constructor(private moffListRepository: MoffListRepository) {}

  /**
   *  모프 정보 리스트
   * @param dto 모프 종류 리스트
   * @returns
   */
  async getMoffInfo() {
    const result = await this.moffListRepository.find({
      select: {
        category: true,
        name: true,
      },
    });
    return result;
  }
}
