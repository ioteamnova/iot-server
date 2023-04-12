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
  readonly email: string;

  @ApiProperty({
    description: '비밀번호',
    default: 'qwer1234#',
    required: true,
  })
  @IsNotEmpty()
  readonly password: string;

  // @ApiProperty({
  //   description: '인가코드',
  //   default: 'asdf1234#',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // readonly accessToken: string;

  // @ApiProperty({
  //   description: '소셜 로그인 타입',
  //   default: null,
  //   required: false,
  // })
  // @IsOptional()
  // readonly socialType: SocialMethodType;
}
