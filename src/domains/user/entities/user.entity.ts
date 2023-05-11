import { Schedule } from '../../schedule/entities/schedule.entity';
import { UpdateUserDto } from './../dtos/update-user.dto';
import BaseEntity from 'src/core/entity/base.entity';
import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SocialMethodType } from 'src/domains/auth/helpers/constants';
import { Pet } from 'src/domains/diary/entities/pet.entity';

@Entity()
export class User extends BaseEntity {
  @Column({
    nullable: false,
    length: 60,
  })
  email: string;

  @Column({
    nullable: false,
    length: 64,
  })
  password: string;

  @Column({
    length: 32,
  })
  nickname: string;

  @Column()
  profilePath: string;

  @Column()
  isPremium: boolean;

  @Column()
  agreeWithMarketing: boolean;

  @Column()
  loginMethod: SocialMethodType;

  @Column()
  fbToken: string;

  @OneToMany(() => Pet, (pet) => pet.user)
  pets: Pet[];

  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules: Schedule[];

  static from({
    email,
    password,
    nickname,
    profilePath,
    isPremium,
    agreeWithMarketing,
    loginMethod,
    fbToken,
  }: {
    email: string;
    password: string;
    nickname: string;
    profilePath: string;
    isPremium: boolean;
    agreeWithMarketing: boolean;
    loginMethod: SocialMethodType;
    fbToken: string;
  }) {
    const user = new User();
    user.email = email;
    user.password = password;
    user.nickname = nickname;
    user.profilePath = profilePath;
    user.isPremium = isPremium;
    user.agreeWithMarketing = agreeWithMarketing;
    user.loginMethod = loginMethod;
    user.fbToken = fbToken;
    return user;
  }

  static fromDto(dto: CreateUserDto) {
    const user = new User();
    user.email = dto.email;
    user.nickname = dto.nickname;
    user.isPremium = dto.isPremium;
    user.agreeWithMarketing = dto.agreeWithMarketing;
    user.password = hashPassword(dto.password);
    // user.fbToken = dto.fbToken;
    return user;
  }

  updateFromDto(dto: UpdateUserDto) {
    this.email = dto.email;
    this.nickname = dto.nickname;
    this.profilePath = dto.profilePath;
  }
}
