import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
// import { PageRequest } from 'src/core/page';

export class CreateLiveStreamDto {
  @ApiProperty({
    description: '게시글 고유번호',
    default: '게시글 고유번호를 입력하는 내용 입니다. ',
    required: true,
  })
  @IsNotEmpty()
  boardIdx: number;

  @ApiProperty({
    description: '유저 고유번호',
    default: '유저 고유번호를 입력하는 내용 입니다. ',
    required: true,
  })
  @IsNotEmpty()
  userIdx: number;

  @ApiProperty({
    description: '최대 인원수',
    default:
      '최대 인원수를 입력하는 부분 입니다. 설정데이터가 아닌 방에 최대로 입장한 수를 기록합니다.',
    required: true,
  })
  @IsNotEmpty()
  maxNum: number;

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
