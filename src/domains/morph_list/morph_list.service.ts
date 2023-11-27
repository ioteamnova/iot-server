import { Injectable } from '@nestjs/common';
import { MorphListRepository } from './repositories/morph-list.repository';

@Injectable()
export class MorphListService {
  constructor(private morphListRepository: MorphListRepository) {}

  /**
   *  모프 정보 리스트
   * @param dto 모프 종류 리스트
   * @returns
   */
  async getMorphInfo() {
    const result = await this.morphListRepository.find({
      select: {
        category: true,
        name: true,
      },
    });
    return result;
  }
}
