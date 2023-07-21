import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';
import { CreateIotAuthDto } from '../dtos/create-iot-auth.dto';

@Entity()
export class IotAuthInfo extends BaseEntity {
  @Column({
    nullable: false,
  })
  userIdx: number;

  @Column({
    nullable: false,
    length: 255,
  })
  boardTempName: string;

  @Column({
    nullable: false,
    length: 255,
  })
  boardSerial: string;

  static fromDto(dto: CreateIotAuthDto) {
    const iotAuthInfo = new IotAuthInfo();
    iotAuthInfo.userIdx = dto.userIdx;
    iotAuthInfo.boardTempName = dto.boardTempName;
    iotAuthInfo.boardSerial = dto.boardSerial;
    return iotAuthInfo;
  }
}
