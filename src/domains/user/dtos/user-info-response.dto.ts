import { User } from 'src/domains/user/entities/user.entity';
import { OmitType } from '@nestjs/swagger';

export class UserInfoResponseDto extends OmitType(User, ['password'] as const) {
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
