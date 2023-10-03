// import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { PickType } from '@nestjs/swagger';

export class FindPasswordDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}
