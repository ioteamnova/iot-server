import { CreateUserDto } from './create-user.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: '프로필 이미지 url',
    default: null,
    required: false,
  })
  @IsString()
  @IsOptional()
  profilePath: string;
}
