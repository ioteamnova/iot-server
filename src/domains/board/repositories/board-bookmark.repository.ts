import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Bookmark } from '../entities/board-bookmark.entity';
import { PageRequest } from 'src/core/page';

@CustomRepository(Bookmark)
export class BoardBookmarkRepository extends Repository<Bookmark> {
  async findMyBid(
    pageRequest: PageRequest,
    userIdx: number,
    category: string,
  ): Promise<[Bookmark[], number]> {
    const [boards, totalCount] = await this.createQueryBuilder('bookmark')
      .leftJoinAndSelect('bookmark.board', 'board')
      .where('bookmark.userIdx = :userIdx', { userIdx: userIdx })
      .andWhere('bookmark.category = :category', { category })
      .orderBy('bookmark.idx', pageRequest.order)
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
    return [boards, totalCount];
  }

  async findBookmark(
    userIdx: number,
    boardIdx: number,
  ): Promise<Bookmark> {
    const result = await this.createQueryBuilder('bookmark')
    .where('bookmark.user_idx = :userIdx', { userIdx })
    .andWhere('bookmark.post_idx = :boardIdx', { boardIdx })
    .getOne();
    return result;
  }

  async countBookmarks(boardIdx: number): Promise<number> {
    const count = await this.createQueryBuilder('bookmark')
      .where('bookmark.post_idx = :boardIdx', { boardIdx })
      .getCount();
  
    return count;
  }

}
