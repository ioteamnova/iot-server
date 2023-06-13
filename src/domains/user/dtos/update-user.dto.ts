import { CreateUserDto } from './create-user.dto';
import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {}
