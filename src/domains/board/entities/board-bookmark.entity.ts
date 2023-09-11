import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Board } from './board.entity';

@Entity()
export class Bookmark extends BaseEntity {
  @Column()
  category: string;

  @Column()
  postIdx: number;

  @Column()
  userIdx: number;

  @OneToOne(() => Board)
  @JoinColumn({ name: 'post_idx', referencedColumnName: 'idx' }) // postIdx와 idx를 일치시킴
  board: Board;
}
