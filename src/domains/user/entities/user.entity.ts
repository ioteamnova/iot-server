import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';

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
  isPremium: string;

  @Column()
  agreeWithEmail: string;
}
