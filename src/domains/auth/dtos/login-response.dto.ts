import { PickType, ApiProperty } from '@nestjs/swagger';
import { SocialLoginUserDto } from './social-login-user.dto';

export class LoginResponseDto {
  @ApiProperty({
    description: '유저 인덱스',
    default: 1,
  })
  idx: number;

  @ApiProperty({
    description: '액세스 토큰',
    default: 'W2uID5fWO5NllVWLKMWZvQPo0W_F2FZbEeilIiVMCinI2gAAAYd0M97K',
  })
  accessToken: string;
}
