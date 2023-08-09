import {
  Controller,
  Get,
  Res,
  Query,
  Post,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { IotBoardPersonalService } from './iot_board_personal.service';
//import { Iot_personal } from './entities/iot_personal.entity';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageRequest } from 'src/core/page';
import UseAuthGuards from '../auth/auth-guards/use-auth';
import AuthUser from 'src/core/decorators/auth-user.decorator';
import { User } from 'src/domains/user/entities/user.entity';
import { SwaggerTag } from 'src/core/swagger/swagger-tags';
import { ApiCommonErrorResponseTemplate } from 'src/core/swagger/api-error-common-response';
import HttpResponse from 'src/core/http/http-response';
import { IotNaturePageRequest } from './dtos/iot-nature-page';
import { IotControlPageRequest } from './dtos/iot-control-page';

@ApiTags(SwaggerTag.IOT)
@ApiCommonErrorResponseTemplate()
@Controller('iotpersonal')
export class IotBoardPersonalController {
  constructor(private readonly iotPersonalService: IotBoardPersonalService) {}

  //나의 보드리스트
  @ApiOperation({
    summary: '내 보드 정보 리스트',
    description: '내가 등록한 보드의 리스트를 가져온다.',
  })
  @UseAuthGuards()
  @Get('/myboardlist')
  async getMyBoardList(
    @Res() res,
    @AuthUser() user: User,
    @Query() pageRequest: PageRequest,
  ) {
    console.log('boardlist start!!');
    console.log('user:::', user);
    console.log(pageRequest);

    const result = await this.iotPersonalService.getMyBoardList(
      user.idx,
      pageRequest,
    );
    return HttpResponse.ok(res, result);
  }

  //전체보드리스트
  @ApiOperation({
    summary: '전체 보드 정보 리스트',
    description: '전체 보드의 리스트를 가져온다.',
  })
  @UseAuthGuards()
  @Get('/boardlist')
  async getBoardList(
    @Res() res,
    @AuthUser() user: User,
    @Query() pageRequest: PageRequest,
  ) {
    console.log('boardlist start!!');
    console.log('user:::', user);
    console.log(pageRequest);

    const result = await this.iotPersonalService.getBoardList(
      user.idx,
      pageRequest,
    );
    return HttpResponse.ok(res, result);
  }

  //온습도 통계 리스트
  @ApiOperation({
    summary: '선택한 보드의 온습도 기록 리스트',
    description: '선택한 보드의 기록된 온습도의 정보 리스트를 가져온다.',
  })
  @UseAuthGuards()
  @Get('/naturelist')
  async getNatureList(
    @Res() res,
    @AuthUser() user: User,
    @Query() pageRequest: IotNaturePageRequest,
  ) {
    console.log('natureList start!!');
    console.log('user:::', user);
    console.log(pageRequest);

    const result = await this.iotPersonalService.getNatureList(pageRequest);
    return HttpResponse.ok(res, result);
  }

  //제어모듈 통계 리스트
  @ApiOperation({
    summary: '선택한 보드의 제어모듈 기록 리스트',
    description: '선택한 보드의 기록된 제어모듈 정보 리스트를 가져온다.',
  })
  @UseAuthGuards()
  @Get('/controllist')
  async getControlList(
    @Res() res,
    @AuthUser() user: User,
    @Query() pageRequest: IotControlPageRequest,
  ) {
    console.log('controllist start!!');
    console.log('user:::', user);
    console.log(pageRequest);

    const result = await this.iotPersonalService.getControlList(pageRequest);
    return HttpResponse.ok(res, result);
  }

  @ApiOperation({
    summary: '새로운 시리얼 보드를 생성',
    description:
      '새로운 시리얼 보드를 생성한다. 보드 시퀀스 가장 초기에 생성하는 부분이다. ',
  })
  @UseAuthGuards()
  @Post('/creat_serialboard')
  async createSerialBoard(
    @Res() res,
    // @Param('petIdx') petIdx: number,
    // @Body() dto: CreatePetDto,
    @AuthUser() user: User,
  ) {
    const currentAuthInfo = await this.iotPersonalService.getAuthInfo_current();

    //currentAuthInfo.boardTempName 여기서 숫자만 늘어나도록 할 것
    const authNum = currentAuthInfo.boardTempName.split('KR_B')[1];
    const newAuthNum = parseInt(authNum) + 1;

    //20자에서 영어 대문자 섞기
    const bigAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXTZ';
    const string_length = 20;
    let randomstring = '';
    for (let i = 0; i < string_length; i++) {
      const rnum = Math.floor(Math.random() * bigAlphabet.length);
      randomstring += bigAlphabet.substring(rnum, rnum + 1);
    }

    //boardSerial 중복 막기
    const chkDuplicate = await this.iotPersonalService.chkAuthInfoDuplicate(
      randomstring,
    );

    console.log('chkDuplicate');
    console.log(chkDuplicate);

    if (chkDuplicate == null) {
      const iot_auth_info: any = {
        userIdx: user.idx,
        boardTempName: 'KR_B' + newAuthNum,
        boardSerial: randomstring,
      };
      console.log(iot_auth_info);

      const result = await this.iotPersonalService.createAuthInfo(
        iot_auth_info,
      );
      return HttpResponse.ok(res, result);
    } else {
      const result = false;
      return HttpResponse.ok(res, result);
    }
  }
}
