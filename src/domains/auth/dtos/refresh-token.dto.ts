import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: '리프레시 토큰',
    default: 'as2dmlk9876_awreglkmvszdklfmnkafkzfnasjdfnadsf',
  })
  @IsNotEmpty()
  refreshToken: string;
}
