import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class StreamKeyDto {
  @ApiProperty({
    description: 'Stream Key Random',
    default: '72js-y0ep-br45-29at-8y88',
  })
  name: string;
}
