import { ScheduleListDto } from './dtos/schedule-list.dto';
import { SwaggerTag } from '../../core/swagger/swagger-tags';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import { UpdateScheduleDto } from './dtos/update-schedule.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCreatedResponseTemplate } from 'src/core/swagger/api-created-response';
import { ApiErrorResponseTemplate } from 'src/core/swagger/apt-error-response';
import { StatusCodes } from 'http-status-codes';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import HttpResponse from 'src/core/http/http-response';
import AuthUser from 'src/core/decorators/auth-user.decorator';
import { User } from '../user/entities/user.entity';
import UseAuthGuards from '../auth/auth-guards/use-auth';
import { ApiCommonErrorResponseTemplate } from 'src/core/swagger/api-error-common-response';
import { ApiOkPaginationResponseTemplate } from 'src/core/swagger/api-ok-pagination-response';
import { PageRequest } from 'src/core/page';
import { ApiOkResponseTemplate } from 'src/core/swagger/api-ok-response';
@ApiTags(SwaggerTag.SCHEDULE)
@ApiCommonErrorResponseTemplate()
@Controller('/schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({
    summary: '스케줄 생성',
    description: '스케줄을 생성한다.',
  })
  @ApiBody({ type: CreateScheduleDto })
  @ApiCreatedResponseTemplate({ type: CreateScheduleDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_USER],
    },
  ])
  @UseAuthGuards()
  @Post()
  async create(
    @Res() res,
    @Body() dto: CreateScheduleDto,
    @AuthUser() user: User,
  ) {
    const result = await this.scheduleService.create(dto, user.idx);
    return HttpResponse.created(res, { body: result });
  }

  @ApiOperation({
    summary: '반복 스케줄 목록 조회',
    description: '반복 스케줄 목록을 조회한다.',
  })
  @ApiOkPaginationResponseTemplate({ type: ScheduleListDto })
  @UseAuthGuards()
  @Get()
  async findRepeatSchedules(
    @Res() res,
    @AuthUser() user: User,
    @Query() pageRequest: PageRequest,
  ) {
    const result = await this.scheduleService.findRepeatSchedules(
      user.idx,
      pageRequest,
    );
    return HttpResponse.ok(res, result);
  }

  @ApiOperation({
    summary: '달력 스케줄 조회',
    description: '해당 월의 달력 스케줄 전체를 조회한다.',
  })
  @ApiOkPaginationResponseTemplate({ type: ScheduleListDto })
  @UseAuthGuards()
  @Get('/:date')
  async findCalendarSchedules(
    @Res() res,
    @AuthUser() user: User,
    @Param('date') date: string,
  ) {
    const result = await this.scheduleService.findScheduleByDate(
      user.idx,
      date,
    );
    return HttpResponse.ok(res, result);
  }

  @ApiOperation({
    summary: '스케줄 수정',
    description: '스케줄 정보를 수정한다.',
  })
  @ApiOkResponseTemplate({ type: UpdateScheduleDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_SCHEDULE],
    },
  ])
  @UseAuthGuards()
  @Patch('/:scheduleIdx')
  async update(
    @Res() res,
    @Param('scheduleIdx') scheduleIdx: number,
    @Body() dto: UpdateScheduleDto,
  ) {
    const result = await this.scheduleService.update(scheduleIdx, dto);
    return HttpResponse.ok(res, result);
  }

  @ApiOperation({
    summary: '스케줄 삭제',
    description: '스케줄을 삭제한다. ',
  })
  @ApiOkResponseTemplate()
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_SCHEDULE],
    },
  ])
  @UseAuthGuards()
  @Delete('/:scheduleIdx')
  async remove(@Res() res, @Param('scheduleIdx') scheduleIdx: number) {
    await this.scheduleService.remove(scheduleIdx);
    return HttpResponse.ok(res);
  }

  @ApiOperation({
    summary: '스케줄 푸시알림 테스트',
    description: '스케줄 푸시알림 테스트용 API. ',
  })
  @Post('/send')
  async sendNotification(@Res() res) {
    const result = await this.scheduleService.checkSchedules();
    return HttpResponse.ok(res, result);
  }
}
