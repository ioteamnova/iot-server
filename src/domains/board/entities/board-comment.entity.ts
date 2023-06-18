import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export default class BoardComment extends BaseEntity {
  @Column()
  userIdx: number;

  @Column()
  boardIdx: number;

  @Column()
  filePath: string;

  @Column()
  description: string;

  UserInfo: { idx: number; nickname: string; profilePath: string };

  static from({
    boardIdx,
    description,
  }: {
    boardIdx: number;
    description: string;
  }) {
    const comment = new BoardComment();
    comment.boardIdx = boardIdx;
    comment.description = description;
    return comment;
  }
  static updateFrom({
    boardIdx,
    idx,
    description,
  }: {
    boardIdx: number;
    description: string;
    idx: number;
  }) {
    const comment = new BoardComment();
    comment.boardIdx = boardIdx;
    comment.description = description;
    comment.idx = idx;
    return comment;
  }
}
