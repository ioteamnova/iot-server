import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';
import { CreateLiveStreamDto } from '../dtos/create-live-stream.dto';
import { UpdateLiveEndTimeDto } from '../dtos/update-live-end-time.dto';
import { UpdateLiveStartTimeDto } from '../dtos/update-live-start-time.dto';

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
    liveStream.maxNum = dto.maxNum;
    liveStream.startTime = dto.startTime;
    liveStream.endTime = dto.endTime;
    liveStream.state = dto.state;
    return liveStream;
  }
  updateEndFromDto(dto: UpdateLiveEndTimeDto) {
    this.endTime = dto.endTime;
    this.state = dto.state;
  }
  updateStartFromDto(dto: UpdateLiveStartTimeDto) {
    this.startTime = dto.startTime;
    this.endTime = dto.endTime;
    this.state = dto.state;
  }
}
