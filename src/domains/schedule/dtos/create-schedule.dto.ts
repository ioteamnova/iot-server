import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({
    description: '스케줄링 제목',
    default: '무근이 밥주기',
    required: true,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '푸시 알림 받을 시간',
    default: '18:00',
    required: true,
  })
  @IsNotEmpty()
  alarmTime: Date;

  @ApiProperty({
    description: '푸시 알림 반복할 요일',
    default: [0, 0, 0, 0, 0, 0, 0],
    required: false,
  })
  @IsNotEmpty()
  repeat: number[];

  @ApiProperty({
    description: '스케줄링 내용',
    default: '밥 끝까지 먹는지 확인하기',
    required: false,
  })
  @IsOptional()
  memo: string;
}
