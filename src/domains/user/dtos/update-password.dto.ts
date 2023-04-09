import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PasswordRegex } from 'src/utils/password.utils';

export class UpdatePasswordDto {
  @ApiProperty({
    description: '현재 비밀번호',
    default: 'qwer1234#',
  })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: `변경할 비밀번호.
    비밀번호 정책은 다음과 같음
    - 영문, 숫자, 특수문자 조합 8자 이상
    - 최대 64자인데 UI에는 표기하지 않음
    ex) qwer1234#
    `,
    default: 'qwer12345#',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(PasswordRegex, {
    message:
      '비밀번호 형식이 적절하지 않습니다. 비밀번호는 영문, 숫자, 특수문자가 포함된 8자 이상으로만 가능합니다.',
  })
  newPassword: string;
}
