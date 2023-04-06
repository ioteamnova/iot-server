import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { PasswordRegex } from 'src/utils/password.utils';

export class UpdateUserDto {
  @ApiProperty({
    description: '이메일',
    default: 'asd123qwe@gmail.com',
  })
  @IsEmail()
  @IsOptional()
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
  @IsString()
  @IsOptional()
  @Matches(PasswordRegex, {
    message:
      '비밀번호 형식이 적절하지 않습니다. 비밀번호는 영문, 숫자, 특수문자가 포함된 8자 이상으로만 가능합니다.',
  })
  password: string;

  @ApiProperty({
    description: '닉네임',
    default: '김수정',
  })
  @IsString()
  @IsOptional()
  @MaxLength(32)
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지 url',
    default: 'https://image.xxx.xx/xx...',
  })
  @IsString()
  @IsOptional()
  profilePath: string;
}
