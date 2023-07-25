import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BoardActionRepository } from '../board/repositories/board-action.repository';
import { HttpErrorConstants } from '../../core/http/http-error-objects';
import { StreamKeyDto } from './dtos/steam-key.dto';
import { CreateLiveStreamDto } from './dtos/create-live-stream.dto';
import { LiveStream } from './entities/live-stream-record.entity';
import { LiveStreamRepository } from './repositories/live-stream-record.repository';
import { UpdateLiveEndTimeDto } from './dtos/update-live-end-time.dto';
import { UpdateLiveStartTimeDto } from './dtos/update-live-start-time.dto';
// import { Ivschat } from 'aws-sdk';

@Injectable()
export class LiveStreamService {
  constructor(
    private liveStreamRepository: LiveStreamRepository,
    private boardActionRepository: BoardActionRepository,
  ) {}
  /**
   *  라이브 스트리밍 정보 추가
   * @param dto 라이브 스트리밍 추가 dto
   * @returns StreamKeyDto
   */
  async createLiveStreamInfo(dto: StreamKeyDto) {
    //1. 키 형식 체크 : 맞으면 통과, 틀리면 false
    //2. 경매 리스트에 스트림 키가 있는지 검토 : 있으면 통과, 없으면 false
    //3. 통과 -> liveStream table에 저장 : action에 관련된 정보는 action에서 가져옴, 시작 시간 저장

    const stream_val = this.liveStreamRepository.checkStreamKeyForm(dto.name);
    // console.log('stream_val');
    // console.log(stream_val);
    if (stream_val) {
      const actionInfo = await this.boardActionRepository.findOne({
        where: {
          streamKey: dto.name,
        },
      });
      if (actionInfo) {
        //저장하기 전에 해당 키로 데이터가 있으면 업데이트만 해줄 것.
        const LiveStreamChk = await this.liveStreamRepository.findOne({
          where: {
            streamKey: actionInfo.streamKey,
          },
        });

        //존재한다면 업데이트
        if (LiveStreamChk) {
          const liveStreamData: UpdateLiveStartTimeDto = {
            startTime: new Date(),
            endTime: null,
            state: 1,
          };

          //update
          LiveStreamChk.updateStartFromDto(liveStreamData);
          await this.liveStreamRepository.save(LiveStreamChk);
        } else {
          //추가
          const liveStreamData: CreateLiveStreamDto = {
            boardIdx: actionInfo.boardIdx,
            streamKey: actionInfo.streamKey,
            maxNum: 0,
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
        throw new UnauthorizedException(
          HttpErrorConstants.LIVESTREAMINFO_NOT_EXIST,
        );
      }
    }
  }

  /**
   *  라이브 스트리밍 정보 수정
   * @param dto 라이브 스트리밍 수정 dto
   * @returns StreamKeyDto
   */
  async modifyLiveStreamInfo(dto: StreamKeyDto) {
    //스트리밍이 끝났을 때 실행할 함수
    //1. 키 형식 체크 : 맞으면 통과, 틀리면 false
    //2. 경매 리스트에 스트림 키가 있는지 검토 : 있으면 통과, 없으면 false
    //3. 통과 -> liveStream table에 저장 : action에 관련된 정보는 action에서 가져옴, 시작 시간 저장

    const stream_val = this.liveStreamRepository.checkStreamKeyForm(dto.name);

    console.log('stream_val');
    console.log(stream_val);
    if (stream_val) {
      const actionInfo = await this.boardActionRepository.findOne({
        where: {
          streamKey: dto.name,
        },
      });
      if (actionInfo) {
        console.log('endstart add');
        console.log(actionInfo);

        const LiveStreamChk = await this.liveStreamRepository.findOne({
          where: {
            streamKey: actionInfo.streamKey,
          },
        });

        //존재한다면 업데이트
        if (LiveStreamChk) {
          const liveStreamData: UpdateLiveEndTimeDto = {
            endTime: new Date(),
            state: 0,
          };

          LiveStreamChk.updateEndFromDto(liveStreamData);
          const result = await this.liveStreamRepository.save(LiveStreamChk);
          return result;
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
}
