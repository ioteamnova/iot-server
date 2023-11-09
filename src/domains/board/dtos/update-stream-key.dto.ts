import { ApiProperty, PartialType } from '@nestjs/swagger';
import { createBoardDto } from './create-board.dto';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdateStreamKeyDto {

  // @ValidateIf((object) => object.category === 'auction')
  // @ApiProperty({
  //   description: '내용 *경매글만 필요, 경매 번호.',
  //   default: '65',
  // })
  // @IsString()
  // @IsNotEmpty()
  // auctionIdx: number;


  
  @ValidateIf((object) => object.category === 'auction')
  @ApiProperty({
    description: '스트림키 *경매글만 필요, 스트림키.',
    default: '21Bu-CQfU-im7s-W7NJ-ArLV',
  })
  @IsString()
  @IsNotEmpty()
  streamKey: string;
}
