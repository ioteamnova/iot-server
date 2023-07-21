import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BoardActionRepository } from '../board/repositories/board-action.repository';
import { HttpErrorConstants } from './../../core/http/http-error-objects';
import { StreamKeyDto } from './dtos/steam-key.dto';
import { CreateLiveStreamDto } from './dtos/create-live-stream.dto';
import { LiveStream } from './entities/live-stream.entity';
import { LiveStreamRepository } from './repositories/live-stream.repository';

@Injectable()
export class LiveStreamService {
  constructor(
    private liveStreamRepository: LiveStreamRepository,
    private boardActionRepository: BoardActionRepository,
  ) {}
  /**
   * 라이브 스트리밍 스트림 키 체크
   * @param streamKey live 송신 키
   * @returns true or false
   */
  // async loginLiveStreaming(streamKey: string) {
  //     //accesstoken을 보내오면 디코딩하고 나온 uid를 우리 db에 있는지 확인하고 리턴
  //     // const decodedJwtAccessToken = await this.jwtService.decode(accessToken);
  //     // const user = await this.userRepository.findOne({
  //     //   where: {
  //     //     idx: decodedJwtAccessToken['userIdx'],
  //     //   },
  //     // });
  //     // if (!user) {
  //     //   // 유저가 존재하지 않는 경우에는 NotFoundException 던져주는 것이 일반적이나, 로그인에서만 예외적으로 이메일, 비밀번호 중 어떤 정보가 잘못 됐는지 확인하지 못하게 하기 위하여 UnauthorizedException로 통일함.
  //     //   throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
  //     // } else {
  //     //   return true;
  //     // }
  //     console.log('authLiveStreaming_service');
  //     console.log(streamKey);
  //     //형식 체크 RY1G-TzOv-lPKB-zRLO-sXI3
  //     const streamKey_arr = streamKey.split('-');
  //     console.log(streamKey_arr.length);
  //     if (streamKey_arr.length == 5) {
  //         for (let i = 0; i < streamKey_arr.length; i++) {
  //             console.log(streamKey_arr[i].length);
  //             if (streamKey_arr[i].length != 4) {
  //                 // return false;
  //                 throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
  //             }
  //         }
  //     } else {
  //         throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
  //         // return false;
  //     }
  //     //db체크 추가 예정
  //     //LiveStream
  //     return true;
  // }

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

    console.log('stream_val');
    console.log(stream_val);
    if (stream_val) {
      const actionInfo = await this.boardActionRepository.findOne({
        where: {
          streamKey: dto.name,
        },
      });
      if (actionInfo) {
        const now = new Date();
        const liveStreamData: CreateLiveStreamDto = {
          boardIdx: actionInfo.boardIdx,
          userIdx: 0, //일단 패스 join 해서 가져와야함
          maxNum: 0,
          startTime: now,
          endTime: null,
          state: 0,
        };
        const LiveStreamInfo = LiveStream.fromDto(liveStreamData);
        const result = await this.liveStreamRepository.save(LiveStreamInfo);
        return result;
      } else {
        throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
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

        //update
        // const now = new Date();
        // const liveStreamData: CreateLiveStreamDto = {
        //   boardIdx: actionInfo.boardIdx,
        //   userIdx: 0, //일단 패스 join 해서 가져와야함
        //   maxNum: 0,
        //   startTime: now,
        //   endTime: null,
        //   state: 0,
        // };
        // const LiveStreamInfo = LiveStream.fromDto(liveStreamData);
        // const result = await this.liveStreamRepository.save(LiveStreamInfo);
        // return result;
      } else {
        throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
      }
    }
  }
}
