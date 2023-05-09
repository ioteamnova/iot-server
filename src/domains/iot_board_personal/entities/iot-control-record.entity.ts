//import { UpdateUserDto } from './../dtos/update-user.dto';
import BaseEntity from 'src/core/entity/base.entity';
//import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity } from 'typeorm';
//import { CreateUserDto } from '../dtos/create-user.dto';
import { IsType } from './enums';

@Entity()
export class IotControlRecord extends BaseEntity {
  @Column({
    nullable: false,
    //length: 11,
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
