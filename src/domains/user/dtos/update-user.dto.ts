import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: '이메일',
    default: 'asd123qwe@gmail.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: '닉네임',
    default: '김수정',
    required: false,
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
