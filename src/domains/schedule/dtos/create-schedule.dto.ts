import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { SchedulesType } from '../helper/constants';

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
  alarmTime: string;

  @ApiProperty({
    description: `푸시 알림 반복할 요일
    일~월요일에서 알림을 설정한 날을 1과 0으로 표현한다.
    ex) 월,수,금 반복인경우 0,1,0,1,0,1,0`,
    default: '0, 0, 0, 0, 0, 0, 0',
    required: false,
  })
  @IsOptional()
  repeat: string;

  @ApiProperty({
    description: '스케줄링 내용',
    default: '밥 끝까지 먹는지 확인하기',
    required: false,
  })
  @IsOptional()
  memo: string;

  @ApiProperty({
    description: `스케줄링 종류
    - 달력: CALENDAR
    - 알람: REPETITION
    `,
    enum: SchedulesType,
    default: SchedulesType.CALENDAR,
    required: true,
  })
  @IsNotEmpty()
  type: SchedulesType;

  @ApiProperty({
    description: '달력 날짜',
    type: 'date',
    default: '2023-06-02',
    required: false,
  })
  @IsOptional()
  date: Date;
}
