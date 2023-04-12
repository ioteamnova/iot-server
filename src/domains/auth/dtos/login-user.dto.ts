import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: '이메일',
    default: 'asd123@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: '비밀번호',
    default: 'qwer1234#',
  })
  @IsNotEmpty()
  readonly password: string;

  // @ApiProperty({
  //   description: '엑세스 토큰',
  //   default:
  //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1#',
  // })
  // @IsNotEmpty()
  // @IsString()
  // readonly accessToken: string;

  // @ApiProperty({
  //   description: '소셜 로그인 타입',
  //   default: 'kakao',
  // })
  // @IsNotEmpty()
  // readonly socialType: string;
}
