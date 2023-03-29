import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '이메일',
    default: 'asd123@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: `비밀번호.
비밀번호 정책은 다음과 같음
- 영문, 숫자, 특수문자 조합 8자 이상
- 최대 64자인데 UI에는 표기하지 않음
ex) HakWon123#, hakwon123#
`,
    default: 'qwer1234#',
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  password: string;

  @ApiProperty({
    description: '닉네임',
    default: '김철수',
  })
  @IsString()
  @Length(8, 32)
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지 url',
    default: 'https://image.xxx.xx/xx...',
  })
  @IsString()
  profilePath: string;

  @ApiProperty({
    description: '구독 여부',
    default: false,
  })
  @IsBoolean()
  isPremium: boolean;

  @ApiProperty({
    description: '이벤트 및 마케팅 이메일 수신 동의 여부',
    default: false,
  })
  @IsBoolean()
  agreeWithMarketing: boolean;
}
