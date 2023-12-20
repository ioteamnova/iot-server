import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCommonErrorResponseTemplate } from 'src/core/swagger/api-error-common-response';
import { SwaggerTag } from 'src/core/swagger/swagger-tags';
import UseAuthGuards from '../auth/auth-guards/use-auth';
import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiErrorResponseTemplate } from 'src/core/swagger/apt-error-response';
import { StatusCodes } from 'http-status-codes';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { MypageService } from './mypage.service';
import AuthUser from 'src/core/decorators/auth-user.decorator';
import { User } from 'src/domains/user/entities/user.entity';
import HttpResponse from 'src/core/http/http-response';
import { BoardCategoryPageRequest } from '../board/dtos/board-category-page';
import { PageRequest } from 'src/core/page';

@ApiTags(SwaggerTag.MYPAGE)
@ApiCommonErrorResponseTemplate()
@Controller('/mypage')
export class Mypagecontroller {
  constructor(private readonly mypageService: MypageService) {}

  @ApiOperation({
    summary: '내가 작성한 게시글 조회',
    description: '게시글(자유, 질문, 마켓, 분양) 중 내가 작성한 글만 조회.',
  })
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
  @Get('/board')
  async findBoard(
    @Res() res,
    @AuthUser() user: User,
    @Query() pageRequest: PageRequest,
  ) {
    const board = await this.mypageService.findBoard(user, pageRequest);
    return HttpResponse.ok(res, board);
  }
  @ApiOperation({
    summary: '내가 작성한 댓글 조회',
    description: '댓글(자유, 질문, 마켓, 분양) 중 내가 작성한 댓글만 조회.',
  })
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
  @Get('/reply')
  async findReply(
    @Res() res,
    @AuthUser() user: User,
    @Query() pageRequest: PageRequest,
  ) {
    const board = await this.mypageService.findReply(user, pageRequest);
    return HttpResponse.ok(res, board);
  }
  @ApiOperation({
    summary: '내가 작성한 경매 조회',
    description: '내가 작성한 경매 조회.',
  })
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
  @Get('/auction')
  async findMyAuction(
    @Res() res,
    @AuthUser() user: User,
    @Query() pageRequest: BoardCategoryPageRequest,
  ) {
    const board = await this.mypageService.findMyAuction(user, pageRequest);
    return HttpResponse.ok(res, board);
  }
  @ApiOperation({
    summary: '내가 작성한 경매 조회',
    description: '내가 작성한 경매 조회.',
  })
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
  @Get('/bid')
  async findMyBidding(
    @Res() res,
    @AuthUser() user: User,
    @Query() pageRequest: PageRequest,
  ) {
    const board = await this.mypageService.findMyBidding(user, pageRequest);
    return HttpResponse.ok(res, board);
  }
  @ApiOperation({
    summary: '내가 북마크한 게시글 조회',
    description:
      '내가 북마크한 게시글 조회. auction만 카테고리에 auction으로 쓰고 나머지는 board',
  })
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
  @Get('/bookmark/:category')
  async findBookMark(
    @Res() res,
    @AuthUser() user: User,
    @Query() pageRequest: PageRequest,
    @Param('category') category: string,
  ) {
    const result = await this.mypageService.findBookMark(
      user,
      pageRequest,
      category,
    );
    return HttpResponse.ok(res, result);
  }

  @ApiOperation({
    summary: '저장한 가치판단 결과들 조회',
    description:
      '해당 계정으로 저장한 가치판단 결과들을 모두 불러옵니다.',
  })
  @UseAuthGuards()
  @Get('/savedValueAnalysisResult')
  async getSavedValueAnalysisResult(
    @Res() res,
    @AuthUser() user: User
  ) {
    const result = await this.mypageService.getSavedValueAnalysisResult(
      user
    );
    return HttpResponse.ok(res, result);
  }
}
