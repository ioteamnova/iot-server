//import { UpdateUserDto } from './../dtos/update-user.dto';
import BaseEntity from 'src/core/entity/base.entity';
//import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
//import { CreateUserDto } from '../dtos/create-user.dto';
import { SocialMethodType } from 'src/domains/auth/helpers/constants';
import { IsType } from './enums';

@Entity()
export class IotNatureRecord extends BaseEntity {
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
  currentTemp2: string;

  @Column()
  currentHumid2: string;


  @Column({ type: 'enum', name: 'type', enum: IsType })
  type: number; //1. auto, 2. passive
}
