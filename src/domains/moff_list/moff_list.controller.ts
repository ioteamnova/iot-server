import { Body, Controller, Post, Get, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SwaggerTag } from 'src/core/swagger/swagger-tags';
import { ApiCommonErrorResponseTemplate } from 'src/core/swagger/api-error-common-response';
import { MoffListService } from './moff_list.service';
import { ApiCreatedResponseTemplate } from 'src/core/swagger/api-created-response';
import HttpResponse from 'src/core/http/http-response';

@ApiTags(SwaggerTag.MOFF)
@ApiCommonErrorResponseTemplate()
@Controller('mofflist')
export class MoffListController {
  constructor(private moffListService: MoffListService) {}

  @ApiOperation({
    summary: '모프 리스트 조회',
    description: `목록 조회 `,
  })
  @ApiCreatedResponseTemplate()
  @Get('/get_moff_list')
  async getMoff(@Res() res) {
    const result = await this.moffListService.getMoffInfo();
    return HttpResponse.created(res, { body: result });
  }
}
