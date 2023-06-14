import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BoardStatus } from '../board-status.enum';
import { BoardImage } from './board-image.entity';
import { UpdateBoardDto } from '../dtos/update-diary.dto';

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
  replyCnt: number;

  @Column()
  status: BoardStatus;

  @OneToMany(() => BoardImage, (image) => image.board)
  images: BoardImage[];

  static from({
    userIdx,
    title,
    category,
    description,
  }: {
    userIdx: number;
    title: string;
    category: string;
    description: string;
  }) {
    const board = new Board();
    board.userIdx = userIdx;
    board.title = title;
    board.category = category;
    board.description = description;
    return board;
  }
  updateFromDto(dto: UpdateBoardDto) {
    this.title = dto.title;
    this.description = dto.description;
  }
}
