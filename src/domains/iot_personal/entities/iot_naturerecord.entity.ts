//import { UpdateUserDto } from './../dtos/update-user.dto';
import BaseEntity from 'src/core/entity/base.entity';
//import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
//import { CreateUserDto } from '../dtos/create-user.dto';
import { SocialMethodType } from 'src/domains/auth/helpers/constants';

@Entity()
export class iot_naturerecord extends BaseEntity {
  @Column({
    nullable: false,
    //length: 11,
  })
  boardIdx: number;

  @Column()
  currentTemp: string;

  @Column()
  currentHumid: string;

  @Column()
  current2Temp: string;

  @Column()
  current2Humid: string;


  @Column()
  type: number; //1. refresh, 2. auto
}
