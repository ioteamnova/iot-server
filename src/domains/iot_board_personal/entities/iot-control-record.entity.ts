import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';
import { IsType } from './enums';

@Entity()
export class IotControlRecord extends BaseEntity {
  @Column({
    nullable: false,
  })
  boardIdx: number;

  @Column()
  light: boolean;

  @Column()
  waterpump: boolean;

  @Column()
  coolingfan: boolean;

  @Column({ type: 'enum', name: 'type', enum: IsType })
  type: number; //1. auto, 2. passive
}
