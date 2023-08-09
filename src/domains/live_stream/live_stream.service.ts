import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpErrorConstants } from '../../core/http/http-error-objects';
import { StreamKeyDto } from './dtos/steam-key.dto';
import { CreateLiveStreamDto } from './dtos/create-live-stream.dto';
import { LiveStream } from './entities/live-stream.entity';
import { LiveStreamRepository } from './repositories/live-stream.repository';
import { UpdateLiveEndTimeDto } from './dtos/update-live-end-time.dto';
import { UpdateLiveStartTimeDto } from './dtos/update-live-start-time.dto';
import { BoardAuctionRepository } from '../board/repositories/board-auction.repository';
// import { Ivschat } from 'aws-sdk';

@Injectable()
export class LiveStreamService {
  constructor(
    private liveStreamRepository: LiveStreamRepository,
    private boardAuctionRepository: BoardAuctionRepository,
  ) {}

  /**
   *  라이브 스트리밍 정보 set
   * @param dto 라이브 스트리밍 start, end 변경 / 전 경매방에 스트림키가 존재하는지 체크
   * @returns StreamKeyDto
   */
  async setLiveStreamInfo(val: string, dto: StreamKeyDto) {
    //스트리밍이 끝났을 때 실행할 함수
    //1. 키 형식 체크 : 맞으면 통과, 틀리면 false
    //2. 경매 리스트에 스트림 키가 있는지 검토 : 있으면 통과, 없으면 false
    //3. 통과 -> liveStream table에 저장 : auction에 관련된 정보는 auction에서 가져옴, 시작 시간 저장

    //키 형식 체크
    const stream_from_chk = this.liveStreamRepository.checkStreamKeyForm(
      dto.name,
    );

    if (stream_from_chk) {
      //경매 테이블에서 해당 키가 있는지 찾기
      const auctionInfo = await this.boardAuctionRepository.findOne({
        where: {
          streamKey: dto.name,
        },
      });

      if (auctionInfo) {
        //있어야 다음 진행

        const liveInfo = await this.liveStreamRepository.findOne({
          where: {
            streamKey: dto.name,
          },
        });

        //start : 추가, 수정

        //end : 수정

        if (val == 'start') {
          //start

          if (liveInfo) {
            //있으면 수정
            const liveStreamData: UpdateLiveStartTimeDto = {
              startTime: new Date(),
              endTime: null,
              state: 1,
            };

            //update
            liveInfo.updateStartFromDto(liveStreamData);
            const result = await this.liveStreamRepository.save(liveInfo);
            return result;
          } else {
            //없으면 추가
            const liveStreamData: CreateLiveStreamDto = {
              boardIdx: auctionInfo.boardIdx,
              streamKey: auctionInfo.streamKey,
              startTime: new Date(),
              endTime: null,
              state: 1,
            };

            // save
            const LiveStreamInfo = LiveStream.fromDto(liveStreamData);
            const result = await this.liveStreamRepository.save(LiveStreamInfo);
            return result;
          }
        } else {
          //end

          if (liveInfo) {
            //있으면 수정

            const liveStreamData: UpdateLiveEndTimeDto = {
              endTime: new Date(),
              state: 0,
            };

            liveInfo.updateEndFromDto(liveStreamData);
            const result = await this.liveStreamRepository.save(liveInfo);
            return result;
          }
        }
      } else {
        throw new UnauthorizedException(
          HttpErrorConstants.LIVESTREAMINFO_NOT_EXIST,
        );
      }
    } else {
      throw new UnauthorizedException(
        HttpErrorConstants.LIVESTREAMINFO_NOT_EXIST,
      );
    }
  }
}
