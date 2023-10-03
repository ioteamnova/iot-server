import BaseEntity from 'src/core/entity/base.entity';
import { Board } from 'src/domains/board/entities/board.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
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

  @OneToOne(() => Board)
  @JoinColumn({ name: 'room_idx', referencedColumnName: 'idx' }) // postIdx와 idx를 일치시킴
  board: Board;

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
