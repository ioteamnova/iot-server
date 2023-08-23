import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Bookmark } from '../entities/board-bookmark.entity';
import { PageRequest } from 'src/core/page';

@CustomRepository(Bookmark)
export class BoardBookmarkRepository extends Repository<Bookmark> {
  async findMyBid(
    pageRequest: PageRequest,
    userIdx: number,
  ): Promise<[Bookmark[], number]> {
    const [boards, totalCount] = await this.createQueryBuilder('bookmark')
      .where('bookmark.userIdx = :userIdx', { userIdx: userIdx })
      .orderBy('bookmark.idx', pageRequest.order)
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
    return [boards, totalCount];
  }
}
