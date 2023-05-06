import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Delete,
    Res,
    UseInterceptors,
    UploadedFile,
    Param,
  } from '@nestjs/common';
import { IotPersonalService } from './iot_personal.service';
//import { Iot_personal } from './entities/iot_personal.entity';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';


@Controller('iotpersonal')
export class IotPersonalController {

    constructor(
        private readonly iotPersonalService: IotPersonalService,
       // private authService: AuthService,
      ) {}

    // @ApiOperation({
    //     summary: '회원 정보 조회',
    //     description: '현재 로그인 중인 회원의 정보를 조회한다.',
    //   })
    //   @ApiOkResponseTemplate({ type: UserInfoResponseDto })
    //   @ApiErrorResponseTemplate([
    //     {
    //       status: StatusCodes.NOT_FOUND,
    //       errorFormatList: [HttpErrorConstants.CANNOT_FIND_USER],
    //     },
    //   ])
    //   @UseAuthGuards()
    //   @Get('/me')
    //   async getUserInfo(@Res() res, @AuthUser() user: User) {
    //     const userInfo = await this.userService.getUserInfo(user.idx);
    //     return HttpResponse.ok(res, userInfo);
    //     // return res.status(200).send(userInfo);
    //   }

    
    //보드리스트
    @ApiOperation({
      summary: '내 보드 정보 리스트',
      description: '내가 등록한 보드의 리스트를 가져온다.',
    })
    @Get("/boardlist/:uid/:offset/:limit")
    async getBoardList(@Param('uid') uid: number, @Param('offset') offset: number, @Param('limit') limit: number) {
      console.log("uid");
      console.log(uid);
      return this.iotPersonalService.getBoardList(uid, offset, limit);
    }

    //온습도 통계 리스트
    @ApiOperation({
      summary: '선택한 보드의 온습도 기록 리스트',
      description: '선택한 보드의 기록된 온습도의 정보 리스트를 가져온다.',
    })
    @Get("/naturelist/:boardidx/:offset/:limit")
    async getNatureList(@Param('boardidx') boardidx: number, @Param('offset') offset: number, @Param('limit') limit: number) {
      console.log("boardidx");
      console.log(boardidx);
      return this.iotPersonalService.getNatureList(boardidx, offset, limit);
    }

    //제어모듈 통계 리스트
    @ApiOperation({
      summary: '선택한 보드의 제어모듈 기록 리스트',
      description: '선택한 보드의 기록된 제어모듈 정보 리스트를 가져온다.',
    })
    @Get("/controllist/:boardidx/:offset/:limit")
    async getControlList(@Param('boardidx') boardidx: number, @Param('offset') offset: number, @Param('limit') limit: number) {
      console.log("boardidx");
      console.log(boardidx);
      return this.iotPersonalService.getControlList(boardidx, offset, limit);
    }


      
}
