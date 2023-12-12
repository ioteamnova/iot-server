import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Board } from './board.entity';

@Entity()
export class BoardCommercial extends BaseEntity {
  @Column()
  boardIdx: number;

  @Column()
  price: number;

  @Column()
  gender: string;

  @Column()
  size: string;

  @Column()
  variety: string;

  @Column()
  state: string;

  @Column({
    nullable: false,
    length: 100,
  })
  pattern: string;

  @Column({
    nullable: false,
    length: 40,
  })
  birthDate: string;

  // 일대일 관계 설정
  @OneToOne(() => Board)
  @JoinColumn({ name: 'board_idx', referencedColumnName: 'idx' }) // idx와 postIdx를 일치시킴
  board: Board;

  static from(
    boardIdx: number,
    gender: string,
    price: number,
    size: string,
    variety: string,
    pattern: string,
    birthDate: string,
  ) {
    const boardCommercial = new BoardCommercial();
    boardCommercial.boardIdx = boardIdx;
    boardCommercial.gender = gender;
    boardCommercial.size = size;
    boardCommercial.price = price;
    boardCommercial.variety = variety;
    boardCommercial.pattern = pattern;
    boardCommercial.birthDate = birthDate;
    return boardCommercial;
  }

  static updateFrom(
    idx: number,
    boardIdx: number,
    gender: string,
    price: number,
    size: string,
    variety: string,
    pattern: string,
    birthDate: string,
    state: string,
  ) {
    const boardCommercial = new BoardCommercial();
    boardCommercial.idx = idx;
    boardCommercial.boardIdx = boardIdx;
    boardCommercial.gender = gender;
    boardCommercial.size = size;
    boardCommercial.price = price;
    boardCommercial.variety = variety;
    boardCommercial.pattern = pattern;
    boardCommercial.birthDate = birthDate;
    boardCommercial.state = state;
    return boardCommercial;
  }
}
