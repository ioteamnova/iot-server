import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class IotBoardPersonal extends BaseEntity {
  @Column({
    nullable: false,
  })
  userIdx: number;

  @Column({
    nullable: false,
    length: 32,
  })
  cageName: string;

  @Column()
  currentLight: boolean;

  @Column()
  autoChkLight: boolean;

  @Column()
  autoChkTemp: boolean;

  @Column()
  autoChkHumid: boolean;

  @Column()
  currentTemp: string;

  @Column()
  currentTemp2: string;

  @Column()
  maxTemp: string;

  @Column()
  minTemp: string;

  @Column()
  currentHumid: string;

  @Column()
  currentHumid2: string;

  @Column()
  maxHumid: string;

  @Column()
  minHumid: string;

  @Column({
    nullable: false,
    length: 32,
  })
  usage: string;

  @Column({
    nullable: false,
    length: 32,
  })
  autoLightUtctimeOn: string;

  @Column({
    nullable: false,
    length: 32,
  })
  autoLightUtctimeOff: string;
}
