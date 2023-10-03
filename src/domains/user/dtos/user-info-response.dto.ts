import { CreateUserDto } from './create-user.dto';
import { User } from 'src/domains/user/entities/user.entity';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class UserInfoResponseDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @ApiProperty({
    description: '인덱스',
    default: 1,
  })
  idx: number;

  @ApiProperty({
    description: '생성일',
    default: '2023-06-13',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일',
    default: '2023-06-13',
  })
  updatedAt: Date;

  constructor(user: User) {
    super();
    (this.idx = user.idx),
      (this.email = user.email),
      (this.nickname = user.nickname),
      (this.loginMethod = user.loginMethod),
      (this.fbToken = user.fbToken),
      (this.isPremium = user.isPremium),
      (this.agreeWithMarketing = user.agreeWithMarketing),
      (this.profilePath = user.profilePath),
      (this.createdAt = user.createdAt),
      (this.updatedAt = user.updatedAt);
  }
}
