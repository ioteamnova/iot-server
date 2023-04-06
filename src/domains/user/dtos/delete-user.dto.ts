import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class DeleteUserDto {
  @ApiProperty({
    description: '비밀번호',
    default: 'qwer1234#',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
