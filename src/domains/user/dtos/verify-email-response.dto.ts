import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponseDto {
  @ApiProperty({
    description: '이메일 인증 토큰',
    default: 'W2uID5fWO5NllVWLKMWZvQPo0W_F2FZbEeilIiVMCinI2gAAAYd0M97K',
  })
  signupVerifyToken: string;
}
