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
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiErrorResponseTemplate } from 'src/core/swagger/apt-error-response';
import { StatusCodes } from 'http-status-codes';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { ApiOkPaginationResponseTemplate } from 'src/core/swagger/api-ok-pagination-response';
import { BoardListDto } from './dtos/board-list.dto';
import { PageRequest } from 'src/core/page';
import { ApiOkResponseTemplate } from 'src/core/swagger/api-ok-response';
import { BoardDetailDto } from './dtos/board-detail-dto';
import { UpdateBoardDto } from './dtos/update-diary.dto';
import { ReplyDto, RereplyDto } from './dtos/reply.dto';
import { createBoardDto } from './dtos/create-board.dto';
import BoardReply from './entities/board-reply.entity';

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
  @Post('/')
  async createBoard(
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
  @ApiOkPaginationResponseTemplate({ type: BoardListDto })
  @Get('')
  async getBoard(
    @Res() res,
    @Query() pageRequest: PageRequest,
    @Query('category') category: string,
  ) {
    const boards = await this.boardService.findAllBoard(pageRequest, category);
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
  @ApiOperation({
    summary: '게시글 수정',
    description: '게시글을 수정한다.',
  })
  @ApiOkResponseTemplate({ type: BoardDetailDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_BOARD],
    },
  ])
  @UseAuthGuards()
  @UseInterceptors(FilesInterceptor('files', 5))
  @Patch('/:boardIdx')
  async updateBoard(
    @Res() res,
    @Param('boardIdx') boardIdx: number,
    @AuthUser() user: User,
    @Body() dto: UpdateBoardDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    dto.deleteIdxArr = [148, 150];
    dto.modifySqenceArr = [5, 6, 2, 4, 0];
    dto.FileIdx = [5, 6];
    const board = await this.boardService.updateBoard(
      boardIdx,
      dto,
      user,
      files,
    );
    return HttpResponse.ok(res, board);
  }
  @ApiOperation({
    summary: '댓글 등록',
    description: '댓글을 등록한다.',
  })
  @ApiCreatedResponseTemplate({ type: ReplyDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_USER],
    },
  ])
  @ApiBody({ type: ReplyDto })
  @UseInterceptors(FileInterceptor('file'))
  @UseAuthGuards()
  @Post('/reply')
  async createReply(
    @Res() res,
    @Body() dto: ReplyDto,
    @AuthUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.boardService.createReply(dto, user.idx, file);
    return HttpResponse.created(res, { body: result });
  }
  @UseAuthGuards()
  @Delete('/reply/:boardIdx')
  async removeReply(
    @Res() res,
    @Query('boardIdx') boardIdx: number,
    @Query('replyIdx') replyIdx: number,
    @AuthUser() user: User,
  ) {
    const result = await this.boardService.removeReply(
      replyIdx,
      boardIdx,
      user.idx,
    );
    return HttpResponse.ok(res, { body: result });
  }
  @ApiOperation({
    summary: '댓글 조회',
    description: '게시글에 달린 댓글 정보를 최신순에 최대 20개씩 조회합니다.',
  })
  @ApiOkPaginationResponseTemplate({ type: BoardReply })
  @Get('/reply/findReply')
  async getReply(
    @Res() res,
    @Query() pageRequest: PageRequest,
    @Query('boardIdx') boardIdx: number,
  ) {
    const replys = await this.boardService.findBoardReply(
      pageRequest,
      boardIdx,
    );
    return HttpResponse.ok(res, replys);
  }
  @ApiOperation({
    summary: '댓글 수정',
    description: '댓글을 수정한다.',
  })
  @ApiCreatedResponseTemplate({ type: ReplyDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_USER],
    },
  ])
  @ApiBody({ type: ReplyDto })
  @UseAuthGuards()
  @UseInterceptors(FileInterceptor('file'))
  @Patch('/updateReply/:replyIdx')
  async updateReply(
    @Res() res,
    @Param('replyIdx') replyIdx: number,
    @AuthUser() user: User,
    @Body() dto: ReplyDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.boardService.updateReply(
      dto,
      replyIdx,
      user.idx,
      file,
    );
    return HttpResponse.created(res, { body: result });
  }
  @ApiOperation({
    summary: '대댓글 등록',
    description: '대댓글을 등록한다.',
  })
  @ApiCreatedResponseTemplate({ type: RereplyDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_USER],
    },
  ])
  @ApiBody({ type: RereplyDto })
  @UseInterceptors(FileInterceptor('file'))
  @UseAuthGuards()
  @Post('/rereply')
  async createRereply(
    @Res() res,
    @Body() dto: RereplyDto,
    @AuthUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.boardService.createRereply(dto, user.idx, file);
    return HttpResponse.created(res, { body: result });
  }
  @UseAuthGuards()
  @Delete('/rereply/remove')
  async removeRereply(
    @Res() res,
    @Query('boardIdx') boardIdx: number,
    @Query('rereplyIdx') rereplyIdx: number,
    @AuthUser() user: User,
  ) {
    const result = await this.boardService.removeRereply(
      rereplyIdx,
      boardIdx,
      user.idx,
    );
    return HttpResponse.ok(res, { body: result });
  }
  @ApiOperation({
    summary: '대댓글 수정',
    description: '대댓글을 수정한다.',
  })
  @ApiCreatedResponseTemplate({ type: ReplyDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_USER],
    },
  ])
  @ApiBody({ type: ReplyDto })
  @UseAuthGuards()
  @UseInterceptors(FileInterceptor('file'))
  @Patch('/updateRereply/:rereplyIdx')
  async updateRereply(
    @Res() res,
    @Param('rereplyIdx') rereplyIdx: number,
    @AuthUser() user: User,
    @Body() dto: RereplyDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.boardService.updateRereply(
      dto,
      rereplyIdx,
      user.idx,
      file,
    );
    return HttpResponse.created(res, { body: result });
  }
  @ApiOperation({
    summary: '대댓글 조회',
    description: '댓글에 달린 대댓글 정보를 최신순에 최대 8개씩 조회합니다.',
  })
  @ApiOkPaginationResponseTemplate({ type: BoardReply })
  @Get('/rereply/findReply:rereplyIdx')
  async getRereply(
    @Res() res,
    @Query() pageRequest: PageRequest,
    @Param('rereplyIdx') rereplyIdx: number,
  ) {
    const rereplys = await this.boardService.findBoardRereply(
      pageRequest,
      rereplyIdx,
    );
    return HttpResponse.ok(res, rereplys);
  }
  @ApiOperation({
    summary: '게시글 북마크 등록 등록',
    description: '게시글에 대한 북마크를 합니다.',
  })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_USER],
    },
  ])
  @UseAuthGuards()
  @Post('/boardBookmark/:boardIdx')
  async boardBookmark(
    @Res() res,
    @Param('boardIdx') boardIdx: number,
    @AuthUser() user: User,
  ) {
    const result = await this.boardService.RegisterBoardBookmark(
      boardIdx,
      user.idx,
    );
    return HttpResponse.created(res, { body: result });
  }
  @ApiOperation({
    summary: '북마크 취소',
    description: '게시글에 대한 북마크를 취소합니다.',
  })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.BOOKMAEK_NOT_EXIST],
    },
  ])
  @UseAuthGuards()
  @Delete('/boardBookmark/:boardIdx')
  async updateBookmark(
    @Res() res,
    @Param('boardIdx') boardIdx: number,
    @AuthUser() user: User,
  ) {
    const board = await this.boardService.boardBookmarkRemove(
      boardIdx,
      user.idx,
    );
    return HttpResponse.ok(res, board);
  }
}
