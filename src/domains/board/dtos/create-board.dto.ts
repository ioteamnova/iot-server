import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, ValidateIf } from 'class-validator';
import { BoardImage } from '../entities/board-image.entity';

export class createBoardDto {
  @ApiProperty({
    description: '유저 번호',
    default: 1,
  })
  userIdx: number;

  @ApiProperty({
    description: '제목?',
    default: '안녕하세요.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  title: string;

  @ApiProperty({
    description: `어떤 게시판인가?\n
    - free(자유게시판)
    - adoption(분양게시판)\n
    - auction(경매게시판)`,
    default: 'free',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: '게시글 내용',
    default: '게시글에 대한 내용입니다.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ValidateIf(
    (object) =>
      object.category === 'adoption' ||
      object.category === 'market' ||
      object.category === 'auction',
  )
  @ApiProperty({
    description:
      '가격 내용 *분양글 or 중고 마켓만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '*분양글 or 중고 or 경매 게시글만* 90000',
  })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: '썸네일',
    default: '썸네일은 fileUrl의 0번째 사진이 들어갑니다.',
  })
  thumbnail: string;

  @ValidateIf(
    (object) => object.category === 'adoption' || object.category === 'auction',
  )
  @ApiProperty({
    description:
      '성별 내용 *분양 or 경매* 글만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '*분양 or 경매* 암컷',
  })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ValidateIf(
    (object) => object.category === 'adoption' || object.category === 'auction',
  )
  @ApiProperty({
    description:
      '크기 내용 *분양글에만 필요 나머지 게시판은 빈값으로 보내주세요.',
    default: '*분양 or 경매* 아성체',
  })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ValidateIf(
    (object) => object.category === 'adoption' || object.category === 'auction',
  )
  @ApiProperty({
    description:
      '품종 내용 *분양글만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '*분양 or 경매* 크레스티드 게코',
  })
  @IsString()
  @IsNotEmpty()
  variety: string;

  @ValidateIf(
    (object) => object.category === 'auction' || object.category === 'adoption',
  )
  @ApiProperty({
    description:
      '해당 종의 패턴 or 모프 *경매만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '*분양 or 경매* 릴리 화이트',
  })
  @IsNotEmpty()
  pattern: string;

  @ValidateIf((object) => object.category === 'auction')
  @ApiProperty({
    description:
      '경매 시작가: 가격 내용 *경매만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '*경매* 50000',
  })
  @IsNotEmpty()
  startPrice: number;

  @ValidateIf((object) => object.category === 'auction')
  @ApiProperty({
    description:
      '경매 입찰 단위 *경매만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '*경매* 10000',
  })
  @IsNotEmpty()
  unit: number;

  @ValidateIf((object) => object.category === 'auction')
  @ApiProperty({
    description:
      '경매 마감 시간 *경매만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '*경매* 2023-08-17 22:00',
  })
  @IsNotEmpty()
  endTime: string;

  @ValidateIf((object) => object.category === 'auction')
  @ApiProperty({
    description:
      '경매 마감 알림 시간 *경매만 필요 & 알람 시간 설정 시만 필요 나머지 게시판은 빈값으로 보내주세요.',
    default: '*경매* 설정 시 ->30 설정 안하면 ->noAlert',
  })
  @IsNotEmpty()
  alertTime: string;

  @ValidateIf((object) => object.category === 'auction')
  @ApiProperty({
    description:
      '경매 연장 룰 *경매만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '*경매* 1',
  })
  @IsNotEmpty()
  extensionRule: number;

  @ValidateIf(
    (object) => object.category === 'auction' || object.category === 'adoption',
  )
  @ApiProperty({
    description:
      '해칭일 or 출생일 *경매만 필요, 나머지 게시판은 빈값으로 보내주세요.',
    default: '*분양 or 경매* 2023-03-12',
  })
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({
    description:
      '미디어(사진, 영상)가 있으면 미디어 처리 서버에 먼저 보내고, DB에 저장될 데이터 리턴 받아 넣어줘야 합니다.',
    default: [
      {
        category: 'video',
        path: 'https://reptimate.s3.ap-northeast-2.amazonaws.com/test/20230629233509-e04030ed-107c-4fc7-93b9-d44fad9469d7-video.m3u8',
        coverImgPath:
          'https://reptimate.s3.ap-northeast-2.amazonaws.com/test/20230629233509-e04030ed-107c-4fc7-93b9-d44fad9469d7-video.jpg',
      },
      {
        category: 'img',
        path: 'https://reptimate.s3.ap-northeast-2.amazonaws.com/board/20230629233511-42b37a7f-20d1-43f3-8615-9cb01e8ac99d-N1.jpeg',
      },
    ],
  })
  fileUrl: BoardImage[];
}
