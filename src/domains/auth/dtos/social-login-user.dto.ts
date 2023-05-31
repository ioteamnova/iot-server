import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SocialMethodType } from '../helpers/constants';

export class SocialLoginUserDto {
  @ApiProperty({
    description: '액세스 토큰',
    default: 'W2uID5fWO5NllVWLKMWZvQPo0W_F2FZbEeilIiVMCinI2gAAAYd0M97K',
    required: false,
  })
  @IsString()
  @IsOptional()
  accessToken: string;

  @ApiProperty({
    description: '소셜 로그인 타입',
    default: SocialMethodType.KAKAO,
    required: true,
    enum: SocialMethodType,
  })
  @IsNotEmpty()
  socialType: SocialMethodType;

  @ApiProperty({
    description: '소셜 로그인 이메일',
    default: 'asd123@gmail.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: '닉네임',
    default: '김철수',
  })
  @IsString()
  @IsOptional()
  @MaxLength(32)
  nickname: string;

  @ApiProperty({
    description: '파이어 베이스 토큰',
    default: 'abcdefg',
    required: true,
  })
  @IsString()
  fbToken: string;
}
