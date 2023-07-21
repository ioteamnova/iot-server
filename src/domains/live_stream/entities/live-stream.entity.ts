import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';
import { CreateLiveStreamDto } from '../dtos/create-live-stream.dto';

@Entity()
export class LiveStream extends BaseEntity {
  @Column({
    nullable: false,
  })
  boardIdx: number;

  @Column({
    nullable: false,
  })
  userIdx: number;

  @Column({
    nullable: false,
  })
  maxNum: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  state: number;

  static fromDto(dto: CreateLiveStreamDto) {
    const liveStream = new LiveStream();
    liveStream.boardIdx = dto.boardIdx;
    liveStream.userIdx = dto.userIdx;
    liveStream.maxNum = dto.maxNum;
    liveStream.startTime = dto.startTime;
    liveStream.endTime = dto.endTime;
    liveStream.state = dto.state;
    return liveStream;
  }
}
