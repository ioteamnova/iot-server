import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ReplyDto {
  @ApiProperty({
    description: '게시글 인덱스 번호',
    default: 1,
  })
  boardIdx: number;

  @ApiProperty({
    description: '댓글 내용',
    default: '댓글에 대한 내용입니다.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;
}
export class RereplyDto extends ReplyDto {
  @ApiProperty({
    description: '댓글 인덱스 번호',
    default: 1,
  })
  replyIdx: number;
}

// export class createReplyDto extends ReplyDto {
//   @ApiProperty({
//     description: '댓글 인덱스 번호',
//     default: 1,
//   })
//   Idx: number;

//   @ApiProperty({
//     description: '유저 번호',
//     default: 1,
//   })
//   userIdx: number;

//   @ApiProperty({
//     description: '이미지 저장 주소입니다. 프론트에서는 작업 안하셔도 됩니다.',
//     default: '',
//   })
//   @IsString()
//   @MaxLength(1000)
//   filePath: string;
// }

// export class createReReplyDto extends createReplyDto {
//   @ApiProperty({
//     description: '댓글 인덱스 번호',
//     default: 1,
//   })
//   reply_idx: number;
// }
