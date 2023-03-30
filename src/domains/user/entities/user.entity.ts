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

  static from(dto: CreateUserDto) {
    const user = new User();
    user.email = dto.email;
    user.nickname = dto.nickname;
    user.profilePath = dto.profilePath;
    user.isPremium = dto.isPremium;
    user.agreeWithMarketing = dto.agreeWithMarketing;
    user.password = hashPassword(dto.password);
    return user;
  }
}
