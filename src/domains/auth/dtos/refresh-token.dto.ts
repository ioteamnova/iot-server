import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: '리프레시 토큰',
    default: 'as2dmlk9876_awreglkmvszdklfmnkafkzfnasjdfnadsf',
  })
  refreshToken: string;
}
