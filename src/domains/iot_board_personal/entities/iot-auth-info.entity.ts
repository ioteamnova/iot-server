import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';

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
  boardTempname: string;

  @Column({
    nullable: false,
    length: 255,
  })
  boardSerial: string;
}
