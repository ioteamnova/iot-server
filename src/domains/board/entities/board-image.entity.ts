import BaseEntity from 'src/core/entity/base.entity';
import { Column, ManyToOne, Entity, JoinColumn } from 'typeorm';
import { Board } from './board.entity';

@Entity()
export class BoardImage extends BaseEntity {
  @Column()
  boardIdx: number;

  @Column()
  category: string;

  @Column()
  mediaSequence: number;

  @Column()
  path: string;

  @ManyToOne(() => Board, (board) => board.images)
  @JoinColumn({ name: 'board_idx' })
  board: Board;
}
