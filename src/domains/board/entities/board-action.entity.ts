import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';
@Entity()
export class BoardAction extends BaseEntity {
  @Column()
  boardIdx: number;

  @Column()
  buyPrice: number;

  @Column()
  startPrice: number;

  @Column()
  unit: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  extension_rule: number;

  @Column({
    nullable: false,
    length: 45,
  })
  gender: string;

  @Column({
    nullable: false,
    length: 45,
  })
  size: string;

  @Column({
    nullable: false,
    length: 300,
  })
  variety: string;

  @Column({
    nullable: false,
    length: 100,
  })
  pattern: string;

  @Column({
    nullable: false,
    length: 40,
  })
  state: string;

  @Column({
    nullable: false,
    length: 150,
  })
  streamKey: string;

  static from(
    boardIdx: number,
    buyPrice: number,
    startPrice: number,
    unit: number,
    startTime: Date,
    endTime: Date,
    extension_rule: number,
    gender: string,
    size: string,
    variety: string,
    pattern: string,
    state: string,
    streamKey: string,
  ) {
    const boardAction = new BoardAction();
    boardAction.boardIdx = boardIdx;
    boardAction.buyPrice = buyPrice;
    boardAction.startPrice = startPrice;
    boardAction.unit = unit;
    boardAction.startTime = startTime;
    boardAction.endTime = endTime;
    boardAction.extension_rule = extension_rule;
    boardAction.gender = gender;
    boardAction.size = size;
    boardAction.variety = variety;
    boardAction.pattern = pattern;
    boardAction.state = state;
    boardAction.streamKey = streamKey;
    return boardAction;
  }

  // static updateFrom(
  //   idx: number,
  //   boardIdx: number,
  //   gender: string,
  //   price: number,
  //   size: string,
  //   variety: string,
  // ) {
  //   const boardAction = new BoardAction();
  //   boardAction.idx = idx;
  //   boardAction.boardIdx = boardIdx;
  //   boardAction.gender = gender;
  //   boardAction.size = size;
  //   boardAction.price = price;
  //   boardAction.variety = variety;
  //   return boardAction;
  // }
}
