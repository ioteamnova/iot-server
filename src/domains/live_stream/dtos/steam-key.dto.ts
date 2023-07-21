import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty } from 'class-validator';

export class StreamKeyDto {
  @ApiProperty({
    description: 'Stream Key Random',
    default: 'TGRT-LmGf-wfVX-x8Ax-7jPw',
  })
  name: string;
}
