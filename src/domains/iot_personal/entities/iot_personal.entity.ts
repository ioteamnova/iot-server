//import { UpdateUserDto } from './../dtos/update-user.dto';
import BaseEntity from 'src/core/entity/base.entity';
//import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
//import { CreateUserDto } from '../dtos/create-user.dto';
import { SocialMethodType } from 'src/domains/auth/helpers/constants';
import { Pet } from 'src/domains/diary/entities/pet.entity';

@Entity()
export class Iot_personal extends BaseEntity {

  @Column({
    nullable: false,
    //length: 11,
  })
  userIdx: number;

  @Column({
    nullable: false,
    //length: 11,
  })
  petIdx: number;

  @Column({
    nullable: false,
    length: 255,
  })
  cageName: string;

  @Column()
  currentLight: boolean;

  @Column()
  autochkLight: boolean;

  @Column()
  autochkWaterpump: boolean;

  @Column()
  autochkCoolingfan: boolean;

  @Column()
  currentTemp: string;
  @Column()
  current2Temp: string;

  @Column()
  maxTemp: string;
  @Column()
  minTemp: string;

  @Column()
  currentHumid: string;
  @Column()
  current2Humid: string;

  @Column()
  maxHumid: string;
  @Column()
  minHumid: string;

  @Column()
  usage: string;


  @OneToOne(() => Pet)
  @JoinColumn({ name: 'pet_idx' })
  pet: Pet;

  // @OneToOne(() => Product, (product) => product.user) // 반대쪽에 매핑된 필드를 2번째 파라미터로 명시
  // @JoinColumn()
  // product: Product;

  // @OneToOne(() => Pet)
  // @JoinColumn({ name: "idx" })
  // pet: Pet;


  // @Column({
  //   nullable: false,
  //   length: 60,
  // })
  // email: string;

  // @Column({
  //   nullable: false,
  //   length: 64,
  // })
  // password: string;

  // @Column({
  //   length: 32,
  // })
  // nickname: string;

  // @Column()
  // profilePath: string;

  // @Column()
  // isPremium: boolean;

  // @Column()
  // agreeWithMarketing: boolean;

  // @Column()
  // loginMethod: SocialMethodType;

  // @OneToMany(() => Pet, (pet) => pet.user)
  // pets: Pet[];

  // static from({
  //   userIdx,
  //   petIdx,
  //   cageName,
  //   currentLight,
  //   autochkLight,
  //   autochkWaterpump,
  //   autochkCoolingfan,
  //   currentTemp,
  //   current2Temp,
  //   maxTemp,
  //   minTemp,
  //   currentHumid,
  //   current2Humid,
  //   maxHumid,
  //   minHumid,
  //   usage,
  // }: {
  //   userIdx: number;
  //   petIdx: number;
  //   cageName: string;
  //   currentLight: boolean;
  //   autochkLight: boolean;
  //   autochkWaterpump: boolean;
  //   autochkCoolingfan: boolean;
  //   currentTemp: string;
  //   current2Temp: string;
  //   maxTemp: string;
  //   minTemp: string;
  //   currentHumid: string;
  //   current2Humid: string;
  //   maxHumid: string;
  //   minHumid: string;
  //   usage: string;
  // }) {
  //   const iot_person = new Iot_personal();
  //   iot_person.userIdx = userIdx;
  //   iot_person.petIdx = petIdx;
  //   iot_person.cageName = cageName;
  //   iot_person.currentLight = currentLight;
  //   iot_person.autochkLight = autochkLight;
  //   iot_person.autochkWaterpump = autochkWaterpump;
  //   iot_person.autochkCoolingfan = autochkCoolingfan;
  //   iot_person.currentTemp = currentTemp;
  //   iot_person.current2Temp = current2Temp;
  //   iot_person.maxTemp = maxTemp;
  //   iot_person.minTemp = minTemp;
  //   iot_person.currentHumid = currentHumid;
  //   iot_person.current2Humid = current2Humid;
  //   iot_person.maxHumid = maxHumid;
  //   iot_person.minHumid = minHumid;
  //   iot_person.usage = usage;
  //   return iot_person;
  // }

  // static fromDto(dto: CreateUserDto) {
  //   const user = new User();
  //   user.email = dto.email;
  //   user.nickname = dto.nickname;
  //   user.isPremium = dto.isPremium;
  //   user.agreeWithMarketing = dto.agreeWithMarketing;
  //   user.password = hashPassword(dto.password);
  //   return user;
  // }

  // updateFromDto(dto: UpdateUserDto) {
  //   this.email = dto.email;
  //   this.nickname = dto.nickname;
  //   this.profilePath = dto.profilePath;
  // }
}
