import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
// import { PageRequest } from 'src/core/page';

export class UpdateLiveStartTimeDto {
  @ApiProperty({
    description: '시작 시간',
    default: '시작 시간을 기록하는 내용 입니다.',
    required: true,
  })
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty({
    description: '종료 시간',
    default: '종료 시간을 기록하는 내용 입니다.',
    required: true,
  })
  @IsNotEmpty()
  endTime: Date;

  @ApiProperty({
    description: '라이브 방송의 상태',
    default: '라이브 방송의 상태를 기록하는 내용 입니다.',
    required: true,
  })
  @IsNotEmpty()
  state: number;
}
