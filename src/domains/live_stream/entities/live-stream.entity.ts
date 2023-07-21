import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';
import { CreateLiveStreamDto } from '../dtos/create-live-stream.dto';
import { UpdateLiveStreamDto } from '../dtos/update-live-stream.dto';

@Entity()
export class LiveStream extends BaseEntity {
  @Column({
    nullable: false,
  })
  boardIdx: number;

  @Column({
    nullable: false,
    length: 150,
  })
  streamKey: string;

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
    liveStream.streamKey = dto.streamKey;
    liveStream.userIdx = dto.userIdx;
    liveStream.maxNum = dto.maxNum;
    liveStream.startTime = dto.startTime;
    liveStream.endTime = dto.endTime;
    liveStream.state = dto.state;
    return liveStream;
  }
  updateFromDto(dto: UpdateLiveStreamDto) {
    this.endTime = dto.endTime;
    this.state = dto.state;
  }
}
