import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export default class BoardComment extends BaseEntity {
  @Column()
  userIdx: number;

  @Column()
  boardIdx: number;

  @Column()
  boardState: string;

  @Column()
  filePath: string;

  @Column()
  description: string;

  @Column()
  replyCnt: number;

  UserInfo: { idx: number; nickname: string; profilePath: string };

  title: string;

  category: string;

  boardCategory: string;

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
  static myPage({
    idx,
    category,
    board_idx,
    file_path,
    user_idx,
    description,
    created_at,
    updated_at,
    deleted_at,
  }: {
    idx: number;
    category: string;
    board_idx: number;
    file_path: string;
    user_idx: number;
    boardIdx: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    description: string;
  }) {
    const comment = new BoardComment();
    comment.idx = idx;
    comment.boardIdx = board_idx;
    comment.category = category;
    comment.filePath = file_path;
    comment.userIdx = user_idx;
    comment.description = description;
    comment.createdAt = created_at;
    comment.updatedAt = updated_at;
    comment.deletedAt = deleted_at;
    return comment;
  }
}
