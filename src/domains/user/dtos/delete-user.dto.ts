import { CreateUserDto } from './create-user.dto';
import { PickType } from '@nestjs/mapped-types';

export default class DeleteUserDto extends PickType(CreateUserDto, [
  'password',
] as const) {}
