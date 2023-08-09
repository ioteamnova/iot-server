import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { BoardAuction } from '../entities/board-auction.entity';
import { UnauthorizedException } from '@nestjs/common';
import { HttpErrorConstants } from '../../../core/http/http-error-objects';

@CustomRepository(BoardAuction)
export class BoardAuctionRepository extends Repository<BoardAuction> {
  checkStreamKeyForm(streamKey: string): boolean {
    //형식 체크 RY1G-TzOv-lPKB-zRLO-sXI3
    const streamKey_arr = streamKey.split('-');
    console.log(streamKey_arr.length);
    if (streamKey_arr.length == 5) {
      for (let i = 0; i < streamKey_arr.length; i++) {
        console.log(streamKey_arr[i].length);
        if (streamKey_arr[i].length != 4) {
          // return false;
          throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
        }
      }
    } else {
      throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
      // return false;
    }
    return true;
  }
}
