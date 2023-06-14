import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export default class BoardRereply extends BaseEntity {
  @Column()
  userIdx: number;

  @Column()
  boardIdx: number;

  @Column()
  replyIdx: number;

  @Column()
  filePath: string;

  @Column()
  description: string;

  static from({
    boardIdx,
    description,
    replyIdx,
  }: {
    boardIdx: number;
    description: string;
    replyIdx: number;
  }) {
    const reply = new BoardRereply();
    reply.boardIdx = boardIdx;
    reply.description = description;
    reply.replyIdx = replyIdx;
    return reply;
  }
  // static updateFrom({
  //   boardIdx,
  //   idx,
  //   description,
  // }: {
  //   boardIdx: number;
  //   description: string;
  //   idx: number;
  // }) {
  //   const reply = new BoardReply();
  //   reply.boardIdx = boardIdx;
  //   reply.description = description;
  //   reply.idx = idx;
  //   return reply;
  // }
}
