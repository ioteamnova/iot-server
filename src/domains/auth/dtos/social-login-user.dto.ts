import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { SocialMethodType } from '../helpers/constants';

export class SocialLoginUserDto {
  @ApiProperty({
    description: '액세스 토큰',
    default: 'W2uID5fWO5NllVWLKMWZvQPo0W_F2FZbEeilIiVMCinI2gAAAYd0M97K',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly accessToken: string;

  @ApiProperty({
    description: '소셜 로그인 타입',
    default: SocialMethodType.KAKAO,
    required: true,
    enum: SocialMethodType,
  })
  @IsNotEmpty()
  readonly socialType: SocialMethodType;
}
