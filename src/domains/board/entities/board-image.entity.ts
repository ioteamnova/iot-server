import BaseEntity from 'src/core/entity/base.entity';
import { Column, ManyToOne, Entity, JoinColumn } from 'typeorm';
import { Board } from './board.entity';

@Entity()
export class BoardImage extends BaseEntity {
  @Column()
  idx: number;

  @Column()
  board_idx: number;

  @Column()
  category: string;

  @Column()
  media_sequence: number;

  @Column()
  Path: string;

  @ManyToOne(() => Board, (board) => board.images)
  @JoinColumn({ name: 'board_idx' })
  board: Board;
}
