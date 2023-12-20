import BaseEntity from 'src/core/entity/base.entity';
import { Board } from 'src/domains/board/entities/board.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
@Entity()
export class ValueAnalyzer extends BaseEntity {
  
  @Column()
  userIdx: number;

  @Column()
  petName: string;

  @Column()
  morph: string;

  @Column()
  gender: string;

  @Column()
  headScore: number;

  @Column()
  dorsalScore: number;

  @Column()
  tailScore: number;

  @Column()
  leftScore: number;

  @Column()
  rightScore: number;

  @Column()
  leftInfo: string;

  @Column()
  rightInfo: string;

  @Column()
  totalScore: number;

  @Column()
  topImg: string;

  @Column()
  leftImg: string;

  @Column()
  rightImg: string;

}
