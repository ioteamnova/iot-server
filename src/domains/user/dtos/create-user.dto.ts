import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { PasswordRegex } from 'src/utils/password.utils';

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
  @Matches(PasswordRegex, {
    message:
      '비밀번호 형식이 적절하지 않습니다. 비밀번호는 영문, 숫자, 특수문자가 포함된 8자 이상으로만 가능합니다.',
  })
  password: string;

  @ApiProperty({
    description: '닉네임',
    default: '김철수',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  nickname: string;

  // @ApiProperty({
  //   description: '파이어베이스 토큰',
  //   default: 'firebase_token',
  //   required: false,
  // })
  // @IsString()
  // @IsOptional()
  // fbToken: string;

  @ApiProperty({
    description: '구독 여부',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPremium: boolean;

  @ApiProperty({
    description: '이벤트 및 마케팅 이메일 수신 동의 여부',
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  agreeWithMarketing: boolean;
}
