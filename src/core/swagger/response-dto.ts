import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  data: T;
  @ApiProperty({
    default: 200,
  })
  status: number;
  @ApiProperty({
    default: 'SUCCESS',
  })
  message: string;
}
