import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    description: '이메일',
    default: 'yjp9603@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
