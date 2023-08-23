import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';
@Entity()
export class ChatConversation extends BaseEntity {
  @Column()
  type: string;

  @Column()
  score: number;

  @Column()
  roomIdx: number;

  @Column()
  userIdx: number;

  @Column()
  message: string;

  @Column()
  action: string;

  static from(
    type: string,
    score: number,
    roomIdx: number,
    userIdx: number,
    message: string,
  ) {
    const chatConversation = new ChatConversation();
    chatConversation.type = type;
    chatConversation.score = score;
    chatConversation.roomIdx = roomIdx;
    chatConversation.userIdx = userIdx;
    chatConversation.message = message;
    return chatConversation;
  }
}
