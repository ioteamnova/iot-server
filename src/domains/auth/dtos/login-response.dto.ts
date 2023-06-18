import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: '유저 인덱스',
    default: 1,
  })
  idx: number;

  @ApiProperty({
    description: '액세스 토큰',
    default: 'W2uID5fWO5NllVWLKMWZvQPo0W_F2FZbEeilIiVMCinI2gAAAYd0M97K',
  })
  accessToken: string;

  @ApiProperty({
    description: '리프레시 토큰',
    default: 'as2dmlk9876_awreglkmvszdklfmnkafkzfnasjdfnadsf',
  })
  refreshToken: string;
}
