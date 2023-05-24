import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PageRequest } from 'src/core/page';

export class CreateIotAuthDto extends PageRequest {
  @ApiProperty({
    description: '유저 고유번호',
    default: '유저 고유번호를 입력하는 부분입니다. ',
    required: true,
  })
  @IsNotEmpty()
  userIdx: number;

  @ApiProperty({
    description: '보드 임시번호',
    default: '사용자에게 보여줄 보드 임시번호 입니다.',
    required: true,
  })
  @IsNotEmpty()
  boardTempname: string;

  @ApiProperty({
    description: '다이어리 내용',
    default: '다이어리 내용입니다.',
    required: true,
  })
  @IsNotEmpty()
  boardSerial: string;
}
