import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import { Repository } from 'typeorm';
import { LiveStream } from '../entities/live-stream-record.entity';
import { UnauthorizedException } from '@nestjs/common';
import { HttpErrorConstants } from '../../../core/http/http-error-objects';

@CustomRepository(LiveStream)
export class LiveStreamRepository extends Repository<LiveStream> {
  // findCurrentOneData(): Promise<IotAuthInfo> {
  //   return this.createQueryBuilder('iotauth').orderBy('idx', 'DESC').getOne();
  // }
  // chkAuthInfoDuplicate(boardSerial: string): Promise<IotAuthInfo> {
  //   return this.createQueryBuilder('iotauth')
  //     .where({ boardSerial: boardSerial })
  //     .orderBy('idx', 'DESC')
  //     .getOne();
  // }

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
