import { ApiProperty } from '@nestjs/swagger';

export class RequestScheduleDto {
  @ApiProperty({
    description: '파어이베이스 토큰',
    default: ['aaa', 'bbb'],
  })
  fbToken: string[];
}
