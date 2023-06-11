import { ApiProperty, PartialType } from '@nestjs/swagger';
import { createBoardDto } from './create-board.dto';

export class UpdateBoardDto extends PartialType(createBoardDto) {
  @ApiProperty({
    description: '수정할 시퀀스 값을 넣어 주세요.',
    default: [3, 0, 2],
  })
  modifySqenceArr: number[];

  @ApiProperty({
    description: '삭제할 미디어 Idx를 넣어주세요.',
    default: [88],
  })
  deleteIdxArr: number[];

  @ApiProperty({
    description: '삭제할 미디어 IDX를 넣어주세요.',
    default: [4, 5],
  })
  FileIdx: number[];
}
