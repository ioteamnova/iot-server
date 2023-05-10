import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { SocialMethodType } from '../helpers/constants';

export class LoginUserDto {
  @ApiProperty({
    description: '이메일',
    default: 'asd123@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '비밀번호',
    default: 'qwer1234#',
    required: true,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: '파이어 베이스 토큰',
    default: '',
    required: false,
  })
  @IsOptional()
  @IsString()
  fbToken: string;
}
