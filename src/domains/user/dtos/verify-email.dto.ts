import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class VerifyEmailDto extends PickType(CreateUserDto, [
  'email',
] as const) {}
