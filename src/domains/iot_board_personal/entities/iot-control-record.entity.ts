import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';
import { ControlType } from './constants';

@Entity()
export class IotControlRecord extends BaseEntity {
  @Column({
    nullable: false,
  })
  boardIdx: number;

  @Column()
  uvbLight: boolean;

  @Column()
  heatingLight: boolean;

  @Column()
  waterPump: boolean;

  @Column()
  coolingFan: boolean;

  @Column({ type: 'enum', name: 'type', enum: ControlType })
  type: number; //1. auto, 2. passive
}
