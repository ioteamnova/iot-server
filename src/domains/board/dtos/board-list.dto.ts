import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { BoardAction } from '../entities/board-action.entity';
import { BoardCommercial } from '../entities/board-commercial.entity';
import { BoardImage } from '../entities/board-image.entity';

export class BoardListDto {
  @ApiProperty({
    description: '보드 넘버',
    default: '31',
  })
  @IsString()
  @MaxLength(32)
  @IsNotEmpty()
  idx: number;

  @ApiProperty({
    description: '유저 인덱스',
    default: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  userIdx: number;

  @ApiProperty({
    description: '어떤 게시판인가?',
    default: 'free',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: '제목',
    default: '안녕하세요.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  title: string;

  @ApiProperty({
    description: '썸네일 사진 주소',
    default: 'https://reptimate.com/fdasfewgfadsharredhasdf.jpg',
  })
  @IsString()
  thumbnail: string;

  @ApiProperty({
    description: '게시글 내용',
    default: '게시글에 대한 내용입니다.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '조회수 입니다',
    default: '187',
  })
  @IsString()
  @IsNotEmpty()
  replyCnt: number;

  @ApiProperty({
    description: '작성일',
    type: 'date',
    default: '2023-04-17',
    required: false,
  })
  @IsNotEmpty()
  writeDate: Date;

  images: BoardImage[];
  boardCommercial: BoardCommercial;
  boardAction: BoardAction;
  UserInfo: { idx: number; nickname: string; profilePath: string };

  status: string;

  view: number;

  static from({
    userIdx,
    title,
    category,
    description,
    createdAt,
    images,
    view,
  }: {
    userIdx: number;
    view: number;
    title: string;
    category: string;
    description: string;
    createdAt: Date;
    images: BoardImage[];
  }) {
    const board = new BoardListDto();
    board.view = view;
    board.userIdx = userIdx;
    board.title = title;
    board.category = category;
    board.description = description;
    board.writeDate = createdAt;
    board.images = images;
    return board;
  }
}
