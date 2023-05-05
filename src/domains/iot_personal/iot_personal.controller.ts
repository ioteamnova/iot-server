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

import { Iot_personal } from './entities/iot_personal.entity';


@Controller('iot-personal')
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
    @Get("/boardlist/:uid/:offset/:limit")
    async getBoardList(@Param('uid') uid: number, @Param('offset') offset: number, @Param('limit') limit: number) {
      console.log("uid");
      console.log(uid);
      return this.iotPersonalService.getBoardList(uid, offset, limit);
    }

    //온습도 통계 리스트


    //




      
}
