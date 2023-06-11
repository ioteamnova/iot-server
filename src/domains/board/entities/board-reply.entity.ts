import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export default class BoardReply extends BaseEntity {
  @Column()
  userIdx: number;

  @Column()
  boardIdx: number;

  @Column()
  filePath: string;

  @Column()
  description: string;

  static from({
    boardIdx,
    description,
  }: {
    boardIdx: number;
    description: string;
  }) {
    const reply = new BoardReply();
    reply.boardIdx = boardIdx;
    reply.description = description;
    return reply;
  }
}
