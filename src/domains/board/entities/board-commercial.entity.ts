import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';
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

  static from(
    boardIdx: number,
    gender: string,
    price: number,
    size: string,
    variety: string,
  ) {
    const boardCommercial = new BoardCommercial();
    boardCommercial.boardIdx = boardIdx;
    boardCommercial.gender = gender;
    boardCommercial.size = size;
    boardCommercial.price = price;
    boardCommercial.variety = variety;
    return boardCommercial;
  }

  static updateFrom(
    idx: number,
    boardIdx: number,
    gender: string,
    price: number,
    size: string,
    variety: string,
  ) {
    const boardCommercial = new BoardCommercial();
    boardCommercial.idx = idx;
    boardCommercial.boardIdx = boardIdx;
    boardCommercial.gender = gender;
    boardCommercial.size = size;
    boardCommercial.price = price;
    boardCommercial.variety = variety;
    return boardCommercial;
  }
}
