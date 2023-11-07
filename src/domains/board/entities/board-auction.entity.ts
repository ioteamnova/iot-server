import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class BoardAuction extends BaseEntity {
  @Column()
  boardIdx: number;

  @Column()
  buyPrice: number;

  @Column()
  startPrice: number;

  @Column()
  currentPrice: number;

  @Column()
  unit: number;

  @Column()
  alertTime: string;

  @Column()
  endTime: string;

  @Column()
  extensionTime: string;

  @Column()
  extensionRule: number;

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
  birthDate: string;

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
    extensionRule: number,
    gender: string,
    size: string,
    variety: string,
    pattern: string,
    birthDate: string,
    state: string,
  ) {
    const boardAuction = new BoardAuction();
    boardAuction.boardIdx = boardIdx;
    boardAuction.buyPrice = buyPrice;
    boardAuction.startPrice = startPrice;
    boardAuction.unit = unit;
    boardAuction.extensionRule = extensionRule;
    boardAuction.gender = gender;
    boardAuction.size = size;
    boardAuction.variety = variety;
    boardAuction.pattern = pattern;
    boardAuction.birthDate = birthDate;
    boardAuction.state = state;
    return boardAuction;
  }
  static updateForm(
    idx: number,
    boardIdx: number,
    buyPrice: number,
    startPrice: number,
    unit: number,
    extensionRule: number,
    gender: string,
    size: string,
    variety: string,
    pattern: string,
    birthDate: string,
    state: string,
    streamKey: string,
  ) {
    const boardAuction = new BoardAuction();
    boardAuction.idx = idx;
    boardAuction.boardIdx = boardIdx;
    boardAuction.buyPrice = buyPrice;
    boardAuction.startPrice = startPrice;
    boardAuction.unit = unit;
    boardAuction.extensionRule = extensionRule;
    boardAuction.gender = gender;
    boardAuction.size = size;
    boardAuction.variety = variety;
    boardAuction.pattern = pattern;
    boardAuction.birthDate = birthDate;
    boardAuction.state = state;
    boardAuction.streamKey = streamKey;
    return boardAuction;
  }
}
