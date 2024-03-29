import { FileInterceptor } from '@nestjs/platform-express';
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
import { UpdateBoardDto } from './dtos/update-board.dto';
import { CommentDto } from './dtos/board-comment.dto';
import { createBoardDto } from './dtos/create-board.dto';
import Boardcomment from './entities/board-comment.entity';
// import { StreamKeyDto } from './dtos/steam-key.dto';
import { BoardCategoryPageRequest } from './dtos/board-category-page';
import { UpdateStreamKeyDto } from './dtos/update-stream-key.dto';
import { ApiOkArrayResponseTemplate } from 'src/core/swagger/api-ok-pagination-response-array';

@ApiTags(SwaggerTag.BOARD)
@ApiCommonErrorResponseTemplate()
@Controller('/board')
export class Boardcontroller {
  constructor(private readonly boardService: BoardService) {}

  @ApiOperation({
    summary: '게시판 등록',
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
  @Post('/')
  async createBoard(
    @Res() res,
    @Body() dto: createBoardDto,
    @AuthUser() user: User,
  ) {
    const result = await this.boardService.createBoard(dto, user.idx);
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
    @Query() pageRequest: BoardCategoryPageRequest,
    @Query('userIdx') userIdx: number,
  ) {
    const boards = await this.boardService.findAllBoard(pageRequest, userIdx);
    return HttpResponse.ok(res, boards);
  }

  @ApiOperation({
    summary: '경매 게시판 조회',
    description: '경매 게시판을 상태 따라 최신 정보를 조회합니다.',
  })
  @ApiOkPaginationResponseTemplate({ type: BoardListDto })
  @Get('/auction')
  async getAuction(
    @Res() res,
    @Query() pageRequest: BoardCategoryPageRequest,
    @Query('userIdx') userIdx: number,
  ) {
    const boards = await this.boardService.findAuction(pageRequest, userIdx);
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
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_BOARD],
    },
  ])
  @Get('/:boardIdx')
  async findBoard(
    @Res() res,
    @Param('boardIdx') boardIdx: number,
    @Query('userIdx') userIdx: number,
  ) {
    const board = await this.boardService.findBoard(boardIdx, userIdx);
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
  @Patch('/:boardIdx')
  async updateBoard(
    @Res() res,
    @Param('boardIdx') boardIdx: number,
    @AuthUser() user: User,
    @Body() dto: UpdateBoardDto,
  ) {
    const board = await this.boardService.updateBoard(boardIdx, dto, user);
    return HttpResponse.ok(res, board);
  }

  @ApiOperation({
    summary: '경매 게시글 스트림키 수정',
    description: '경매 게시글의 스트림키를 수정한다.',
  })
  @ApiOkResponseTemplate({ type: UpdateStreamKeyDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_AUCTION_BOARD],
    },
  ])
  @UseAuthGuards()
  @Patch('/Streamkey/:boardAuctionIdx')
  async updateStreamKey(
    @Res() res,
    @Param('boardAuctionIdx') boardAuctionIdx: number,
    @Body() dto: UpdateStreamKeyDto,
  ) {
    const updatedStreamKey = await this.boardService.updateStreamKey(
      boardAuctionIdx,
      dto,
    );
    return HttpResponse.ok(res, updatedStreamKey);
  }

  @ApiOperation({
    summary: '댓글 & 답글 등록',
    description: '댓글 & 답글을 등록한다.',
  })
  @ApiCreatedResponseTemplate({ type: CommentDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_USER],
    },
  ])
  @ApiBody({ type: CommentDto })
  @UseInterceptors(FileInterceptor('file'))
  @UseAuthGuards()
  @Post('/comment')
  async createcomment(
    @Res() res,
    @Body() dto: CommentDto,
    @AuthUser() user: User,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const result = await this.boardService.createComment(dto, user.idx, file);
    return HttpResponse.created(res, { body: result });
  }
  @ApiOperation({
    summary: '댓글 & 답글 삭제',
    description: '댓글 & 답글을 삭제합니다..',
  })
  @UseAuthGuards()
  @Delete('/comment/:commentIdx')
  async removecomment(
    @Res() res,
    @Query('boardIdx') boardIdx: number,
    @Query('category') category: string,
    @Param('commentIdx') commentIdx: number,
    @AuthUser() user: User,
  ) {
    const result = await this.boardService.removeComment(
      commentIdx,
      boardIdx,
      user.idx,
      category,
    );
    return HttpResponse.ok(res, { body: result });
  }
  @ApiOperation({
    summary: '댓글 & 답글 조회',
    description: '게시글에 달린 댓글 정보를 최신순에 최대 20개씩 조회합니다.',
  })
  @ApiOkPaginationResponseTemplate({ type: Boardcomment })
  @Get('/:boardIdx/:category')
  async getcomment(
    @Res() res,
    @Query() pageRequest: PageRequest,
    @Param('category') category: string,
    @Param('boardIdx') boardIdx: number,
  ) {
    const comments = await this.boardService.findBoardComment(
      pageRequest,
      boardIdx,
      category,
    );
    return HttpResponse.ok(res, comments);
  }
  @ApiOperation({
    summary: '댓글 & 답글 수정',
    description: '댓글을 수정한다.',
  })
  @ApiCreatedResponseTemplate({ type: CommentDto })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_USER],
    },
  ])
  @ApiBody({ type: CommentDto })
  @UseAuthGuards()
  @UseInterceptors(FileInterceptor('file'))
  @Patch('/comment/:commentIdx')
  async updatecomment(
    @Res() res,
    @Param('commentIdx') commentIdx: number,
    @AuthUser() user: User,
    @Body() dto: CommentDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const result = await this.boardService.updateComment(
      dto,
      commentIdx,
      user.idx,
      file,
    );
    return HttpResponse.created(res, { body: result });
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
  @Post('/:boardIdx/Bookmark/:category')
  async boardBookmark(
    @Res() res,
    @Param('boardIdx') boardIdx: number,
    @Param('category') category: string,
    @AuthUser() user: User,
  ) {
    const result = await this.boardService.RegisterBoardBookmark(
      boardIdx,
      user.idx,
      category,
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
  @Delete('/:boardIdx/Bookmark')
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
  @ApiOperation({
    summary: '분양 게시글 맞춤 추천',
    description:
      '사용자 관심도에 따라, 5개의 게시글을 추천을 합니다. 추천할 항목이 없으면 null을 반환합니다',
  })
  @ApiErrorResponseTemplate([
    {
      status: StatusCodes.NOT_FOUND,
      errorFormatList: [HttpErrorConstants.CANNOT_FIND_BOARD],
    },
  ])
  @ApiOkArrayResponseTemplate({ type: BoardListDto })
  @UseAuthGuards()
  @Get('/adoption/recommend/user')
  async findRecommendItem(@Res() res, @AuthUser() user: User) {
    const board = await this.boardService.findRecommendItem(user.idx);
    return HttpResponse.ok(res, board);
  }
  @ApiOperation({
    summary: '통합 검색',
    description:
      'adoption, auction, market, ask, free 게시판 중 최대 5개까지 조회합니다.',
  })
  @ApiOkPaginationResponseTemplate({ type: BoardListDto })
  @Get('/search/total/:keyword')
  async searchTotal(@Res() res, @Param('keyword') keyword: string) {
    const result = await this.boardService.searchTotal(keyword);
    return HttpResponse.ok(res, result);
  }
  @ApiOperation({
    summary: '특정 게시판 더보기 조회',
    description:
      'adoption, auction, market, ask, free 중에서 한 카테고리 키워드 검색',
  })
  @ApiOkPaginationResponseTemplate({ type: BoardListDto })
  @Get('/search/category/:keyword')
  async searchCategory(
    @Res() res,
    @Param('keyword') keyword: string,
    @Query() pageRequest: BoardCategoryPageRequest,
  ) {
    const result = await this.boardService.searchCategory(keyword, pageRequest);
    return HttpResponse.ok(res, result);
  }
}
