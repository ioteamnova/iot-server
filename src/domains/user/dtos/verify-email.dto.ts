import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { EmailVerifyType } from '../helper/constant';
import { CreateUserDto } from './create-user.dto';

export class VerifyEmailDto extends PickType(CreateUserDto, [
  'email',
] as const) {
  @ApiProperty({
    description: '이메일 인증 유형',
    required: true,
    enum: EmailVerifyType,
    default: EmailVerifyType.NEWUSER,
  })
  @IsNotEmpty()
  type: EmailVerifyType;
}
