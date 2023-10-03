import { ApiProperty } from '@nestjs/swagger';

export class CreatedResponseDto<T> {
  data: T;
  @ApiProperty({
    default: 201,
  })
  status: number;
  @ApiProperty({
    default: 'CREATED',
  })
  message: string;

  // @ApiProperty({
  //   description: '생성된 데이터의 인덱스 값',
  //   default: {
  //     idx: 1,
  //   },
  // })
  // result: object;
}
