import { UpdateUserDto } from './../dtos/update-user.dto';
import BaseEntity from 'src/core/entity/base.entity';
import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

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

  static from({
    email,
    password,
    nickname,
    profilePath,
    isPremium,
    agreeWithMarketing,
  }: {
    email: string;
    password: string;
    nickname: string;
    profilePath: string;
    isPremium: boolean;
    agreeWithMarketing: boolean;
  }) {
    const user = new User();
    user.email = email;
    user.password = password;
    user.nickname = nickname;
    user.profilePath = profilePath;
    user.isPremium = isPremium;
    user.agreeWithMarketing = agreeWithMarketing;

    return user;
  }

  static fromDto(dto: CreateUserDto) {
    const user = new User();
    user.email = dto.email;
    user.nickname = dto.nickname;
    user.profilePath = dto.profilePath;
    user.isPremium = dto.isPremium;
    user.agreeWithMarketing = dto.agreeWithMarketing;
    user.password = hashPassword(dto.password);
    return user;
  }

  updateFromDto(dto: UpdateUserDto) {
    this.email = dto.email;
    this.password = hashPassword(dto.password);
    this.nickname = dto.nickname;
    this.profilePath = dto.profilePath;
  }
}
