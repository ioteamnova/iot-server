import BaseEntity from 'src/core/entity/base.entity';
import { hashPassword } from 'src/utils/password.utils';
import { Column, Entity } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';

@Entity()
export class User extends BaseEntity {
  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column()
  nickname: string;

  @Column()
  profilePath: string;

  @Column()
  isPremium: boolean;

  @Column()
  agreeWithEmail: boolean;

  static from(dto: CreateUserDto) {
    const user = new User();
    user.email = dto.email;
    user.nickname = dto.nickname;
    user.profilePath = dto.profilePath;
    user.isPremium = dto.isPremium;
    user.agreeWithEmail = dto.agreeWithEmail;
    user.password = hashPassword(dto.password);
    return user;
  }
}
