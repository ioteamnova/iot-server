import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { SocialMethodType } from '../helpers/constants';

export class SocialLoginUserDto {
  @ApiProperty({
    description: '인가코드',
    default: 'asdf1234#',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly accessToken: string;

  @ApiProperty({
    description: '소셜 로그인 타입',
    default: SocialMethodType.KAKAO,
    required: true,
  })
  @IsNotEmpty()
  readonly socialType: SocialMethodType;
}
