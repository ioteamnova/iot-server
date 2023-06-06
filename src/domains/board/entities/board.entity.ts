import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoardStatus } from '../board-status.enum';
import { BoardImage } from './board-image.entity';

@Entity()
export class Board extends BaseEntity {
  @Column()
  category: string;

  @Column()
  userIdx: number;

  @Column()
  title: string;

  @Column()
  thumbnail: string;

  @Column()
  description: string;

  @Column()
  status: BoardStatus;

  @OneToMany(() => BoardImage, (image) => image.board)
  images: BoardImage[];

  static from({
    userIdx,
    title,
    category,
    description,
    thumbnail,
  }: {
    userIdx: number;
    title: string;
    category: string;
    description: string;
    thumbnail: string;
  }) {
    const board = new Board();
    board.userIdx = userIdx;
    board.title = title;
    board.category = category;
    board.description = description;
    board.thumbnail = thumbnail;
    return board;
  }
}
