import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCreatedResponseTemplate } from 'src/core/swagger/api-created-response';
import { ApiCommonErrorResponseTemplate } from 'src/core/swagger/api-error-common-response';
import { SwaggerTag } from 'src/core/swagger/swagger-tags';
import UseAuthGuards from '../auth/auth-guards/use-auth';
import AuthUser from 'src/core/decorators/auth-user.decorator';
import { User } from 'src/domains/user/entities/user.entity';
import HttpResponse from 'src/core/http/http-response';
import { BoardService } from './board.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { createBoardDto } from './dtos/create-board.dto';
import { ApiErrorResponseTemplate } from 'src/core/swagger/apt-error-response';
import { StatusCodes } from 'http-status-codes';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { ApiOkPaginationResponseTemplate } from 'src/core/swagger/api-ok-pagination-response';
import { BoardInfoDto } from './dtos/boardInfo.dto';
import { PageRequest } from 'src/core/page';
import { ApiOkResponseTemplate } from 'src/core/swagger/api-ok-response';
import { BoardDetailDto } from './dtos/board-detail-dto';

@ApiTags(SwaggerTag.BOARD)
@ApiCommonErrorResponseTemplate()
@Controller('/board')
export class Boardcontroller {
  constructor(private readonly boardService: BoardService) {}

  @ApiOperation({
    summary: '게시판 등록 등록',
    description: '각 게시판 별로 등록한다.',
  })
  @ApiCreatedResponseTemplate({ type: createBoardDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_USER],
    },
  ])
  @ApiBody({ type: createBoardDto })
  @UseAuthGuards()
  @UseInterceptors(FilesInterceptor('files', 5))
  @Post('/upload')
  async createPet(
    @Res() res,
    @Body() dto: createBoardDto,
    @AuthUser() user: User,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const result = await this.boardService.createBoard(dto, user.idx, files);
    return HttpResponse.created(res, { body: result });
  }
  @ApiOperation({
    summary: '게시판 조회',
    description: '게시판 카테고리에 따라 최신 정보를 조회합니다.',
  })
  @ApiOkPaginationResponseTemplate({ type: BoardInfoDto })
  @Get('/all')
  async getBoard(@Res() res, @Query() pageRequest: PageRequest) {
    const boards = await this.boardService.findAllBoard(pageRequest);
    return HttpResponse.ok(res, boards);
  }
  @ApiOperation({
    summary: '게시판 상세조회',
    description: '게시판을 상세 조회 기능입니다.',
  })
  @ApiOkResponseTemplate({ type: BoardDetailDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [
        HttpErrorConstants.CANNOT_FIND_PET,
        HttpErrorConstants.CANNOT_FIND_DIARY,
      ],
    },
  ])
  @UseAuthGuards()
  @Get('/:boardIdx')
  async findBoard(@Res() res, @Param('boardIdx') boardIdx: number) {
    const board = await this.boardService.findDiary(boardIdx);
    return HttpResponse.ok(res, board);
  }
  @ApiOperation({
    summary: '게시글 삭제',
    description: '게시글을 삭제한다.',
  })
  @ApiOkResponseTemplate()
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_BOARD],
    },
  ])
  @UseAuthGuards()
  @Delete('/:boardIdx')
  async removeBoard(
    @Res() res,
    @Param('boardIdx') boardIdx: number,
    @AuthUser() user: User,
  ) {
    await this.boardService.removeBoard(boardIdx, user.idx);
    return HttpResponse.ok(res);
  }
}
