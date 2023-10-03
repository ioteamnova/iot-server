import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export default class BoardReply extends BaseEntity {
  @Column()
  userIdx: number;

  @Column()
  boardIdx: number;

  @Column()
  commentIdx: number;

  @Column()
  boardState: string;

  @Column()
  filePath: string;

  @Column()
  description: string;

  UserInfo: { idx: number; nickname: string; profilePath: string };

  static from({
    boardIdx,
    description,
    commentIdx,
  }: {
    boardIdx: number;
    description: string;
    commentIdx: number;
  }) {
    const reply = new BoardReply();
    reply.boardIdx = boardIdx;
    reply.description = description;
    reply.commentIdx = commentIdx;
    return reply;
  }
}
