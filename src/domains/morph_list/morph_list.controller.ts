import { Body, Controller, Post, Get, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SwaggerTag } from 'src/core/swagger/swagger-tags';
import { ApiCommonErrorResponseTemplate } from 'src/core/swagger/api-error-common-response';
import { MorphListService } from './morph_list.service';
import { ApiCreatedResponseTemplate } from 'src/core/swagger/api-created-response';
import HttpResponse from 'src/core/http/http-response';

@ApiTags(SwaggerTag.MORPH)
@ApiCommonErrorResponseTemplate()
@Controller('morphlist')
export class MorphListController {
  constructor(private morphListService: MorphListService) {}

  @ApiOperation({
    summary: '모프 리스트 조회',
    description: `목록 조회 `,
  })
  @ApiCreatedResponseTemplate()
  @Get('/get_morph_list')
  async getMorph(@Res() res) {
    const result = await this.morphListService.getMorphInfo();
    return HttpResponse.created(res, { body: result });
  }
}
