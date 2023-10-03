import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
    default: 'abcdefg',
    required: true,
  })
  @IsString()
  fbToken: string;
}
