import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { ChatConversation } from '../entities/chat-conversation.entity';
import { PageRequest } from 'src/core/page';

@CustomRepository(ChatConversation)
export class ChatConversationRepository extends Repository<ChatConversation> {
  async findMyBid(
    pageRequest: PageRequest,
    userIdx: number,
  ): Promise<[ChatConversation[], number]> {
    const [boards, totalCount] = await this.createQueryBuilder(
      'chatConversation',
    )
      .where('chatConversation.type = :type', { type: 'auction' })
      .andWhere('chatConversation.userIdx = :userIdx', { userIdx })
      .orderBy('chatConversation.idx', pageRequest.order)
      .take(pageRequest.limit)
      .skip(pageRequest.offset)
      .getManyAndCount();
    return [boards, totalCount];
  }
}
