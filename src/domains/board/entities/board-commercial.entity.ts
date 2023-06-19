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

  // static from({
  //   boardIdx,
  //   price,
  //   gender,
  //   variety,
  // }: {
  //   boardIdx: number;
  //   price: number;
  //   gender: string;
  //   variety: string;
  // }) {
  //   const boardCommercial = new BoardCommercial();
  //   boardCommercial.boardIdx = boardIdx;
  //   boardCommercial.price = price;
  //   boardCommercial.gender = gender;
  //   boardCommercial.variety = variety;
  //   return boardCommercial;
  // }
  // updateFromDto(dto: UpdateBoardDto) {
  //   this.title = dto.title;
  //   this.description = dto.description;
  // }
}
