import { Controller, Get, Res, Query } from '@nestjs/common';
import { IotPersonalService } from './iot_board_personal.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
export class IotPersonalController {
  constructor(private readonly iotPersonalService: IotPersonalService) {}

  //보드리스트
  @ApiOperation({
    summary: '내 보드 정보 리스트',
    description: '내가 등록한 보드의 리스트를 가져온다.',
  })
  @UseAuthGuards()
  @Get('/boardlist')
  async getBoardList(
    @Res() res,
    @AuthUser() user: User,
    @Query() pageRequest: PageRequest,
  ) {
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
    const result = await this.iotPersonalService.getControlList(pageRequest);
    return HttpResponse.ok(res, result);
  }
}
