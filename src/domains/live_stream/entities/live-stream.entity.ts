import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';

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
  status: number;

  // static fromDto(dto: CreateIotAuthDto) {
  //   const iotAuthInfo = new IotAuthInfo();
  //   iotAuthInfo.userIdx = dto.userIdx;
  //   iotAuthInfo.boardTempName = dto.boardTempName;
  //   iotAuthInfo.boardSerial = dto.boardSerial;
  //   return iotAuthInfo;
  // }
}
