import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';
import { UpdateLiveEndTimeDto } from '../dtos/update-live-end-time.dto';
import { UpdateLiveStartTimeDto } from '../dtos/update-live-start-time.dto';
@Entity()
export class BoardAuction extends BaseEntity {
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

  @Column()
  liveStartTime: Date;

  @Column()
  liveEndTime: Date;

  @Column()
  liveState: number;

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
    liveStartTime: Date,
    liveEndTime: Date,
    liveState: number,
  ) {
    const boardAuction = new BoardAuction();
    boardAuction.boardIdx = boardIdx;
    boardAuction.buyPrice = buyPrice;
    boardAuction.startPrice = startPrice;
    boardAuction.unit = unit;
    boardAuction.startTime = startTime;
    boardAuction.endTime = endTime;
    boardAuction.extension_rule = extension_rule;
    boardAuction.gender = gender;
    boardAuction.size = size;
    boardAuction.variety = variety;
    boardAuction.pattern = pattern;
    boardAuction.state = state;
    boardAuction.streamKey = streamKey;
    boardAuction.liveStartTime = liveStartTime;
    boardAuction.liveEndTime = liveEndTime;
    boardAuction.liveState = liveState;
    return boardAuction;
  }
  updateEndFromDto(dto: UpdateLiveEndTimeDto) {
    this.liveEndTime = dto.liveEndTime;
    this.liveState = dto.liveState;
  }
  updateStartFromDto(dto: UpdateLiveStartTimeDto) {
    this.liveStartTime = dto.liveStartTime;
    this.liveEndTime = dto.liveEndTime;
    this.liveState = dto.liveState;
  }
}
