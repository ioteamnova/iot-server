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
