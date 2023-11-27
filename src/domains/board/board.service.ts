import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { createBoardDto } from './dtos/create-board.dto';
import { S3FolderName, mediaUpload } from 'src/utils/s3-utils';
import { BoardRepository } from './repositories/board.repository';
import { BoardImage } from './entities/board-image.entity';
import { Board } from './entities/board.entity';
import { Page, PageRequest } from 'src/core/page';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { UpdateBoardDto } from './dtos/update-board.dto';
import AuthUser from 'src/core/decorators/auth-user.decorator';
import { User } from 'src/domains/user/entities/user.entity';
import { CommentDto } from './dtos/board-comment.dto';
import Comment from './entities/board-comment.entity';
import { BoardCommentRepository } from './repositories/board-comment.repository';
import { BoardImageRepository } from './repositories/board-image.repository';
import BoardReply from './entities/board-reply.entity';
import BoardComment from './entities/board-comment.entity';
import { BoardReplyRepository } from './repositories/board-reply.repository';
import { BoardBookmarkRepository } from './repositories/board-bookmark.repository';
import { Bookmark } from './entities/board-bookmark.entity';
import { BoardCommercial } from './entities/board-commercial.entity';
import { BoardCommercialRepository } from './repositories/board-commercial.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { BoardListDto } from './dtos/board-list.dto';
import { fileValidate } from 'src/utils/fileValitate';
import { DataSource, QueryRunner } from 'typeorm';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { BoardAuctionRepository } from './repositories/board-auction.repository';
import { BoardCategoryPageRequest } from './dtos/board-category-page';
import { LiveStreamRepository } from '../live_stream/repositories/live-stream.repository';
import { BoardAuction } from './entities/board-auction.entity';
import * as moment from 'moment';
import { BoardVerifyType, BoardOrderCriteria } from '../user/helper/constant';
import { UpdateStreamKeyDto } from './dtos/update-stream-key.dto';
import { ClientRecommend } from 'src/utils/client-recommend';
import { BoardElasticSearch } from './providers/elastic-search';

@Injectable()
export class BoardService {
  constructor(
    private boardRepository: BoardRepository,
    private userRepository: UserRepository,
    private boardImageRepository: BoardImageRepository,
    private commentRepository: BoardCommentRepository,
    private replyRepository: BoardReplyRepository,
    private boardBookmarkRepository: BoardBookmarkRepository,
    private boardCommercialRepository: BoardCommercialRepository,
    private dataSource: DataSource,
    private readonly redisService: RedisService,
    private boardAuctionRepository: BoardAuctionRepository,
    private liveStreamRepository: LiveStreamRepository,
    private clientRecommend: ClientRecommend,
    private boardElasticSearch: BoardElasticSearch,
  ) {}
  /**
   * 게시판 다중 파일 업로드
   * @param files 파일들
   */
  async createBoard(dto: createBoardDto, userIdx: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 게시글 저장
      dto.userIdx = userIdx;
      if (dto.fileUrl[0].category === 'video') {
        dto.thumbnail = dto.fileUrl[0].coverImgPath;
      } else {
        dto.thumbnail = dto.fileUrl[0].path;
      }
      const board = Board.from(dto);
      const boardInfo = await queryRunner.manager.save(board);
      // 2. 커머셜 or 경매 게시글 저장
      if (await this.isCommercialCate(board.category)) {
        const boardCommercial = BoardCommercial.from(
          boardInfo.idx,
          dto.gender,
          dto.price,
          dto.size,
          dto.variety,
          dto.pattern,
          dto.birthDate,
        );
        await queryRunner.manager.save(boardCommercial);
        boardInfo.boardCommercial = boardCommercial;
      }
      if (await this.isAuctionCate(dto.category)) {
        const boardAuction = BoardAuction.from(
          boardInfo.idx,
          dto.price,
          dto.startPrice,
          dto.unit,
          dto.extensionRule,
          dto.gender,
          dto.size,
          dto.variety,
          dto.pattern,
          dto.birthDate,
          'temp',
        );
        boardAuction.extensionTime = dto.endTime;
        boardAuction.endTime = moment(dto.endTime)
          .add(1, 'minute')
          .format('YYYY-MM-DD HH:mm');

        if (dto.alertTime !== 'noAlert') {
          boardAuction.alertTime = moment(dto.endTime)
            .subtract(dto.alertTime, 'minute')
            .format('YYYY-MM-DD HH:mm');
        }
        await queryRunner.manager.save(boardAuction);
        boardInfo.boardAuction = boardAuction;
      }
      // 3. 이미지 테이블에 s3 주소 저장
      if (dto.fileUrl) {
        const mediaInfo = [];
        for (let i = 0; i < dto.fileUrl.length; i++) {
          const fileData = dto.fileUrl[i];
          fileData.boardIdx = boardInfo.idx;
          fileData.mediaSequence = i;
          mediaInfo.push(fileData);
        }
        await queryRunner.manager.save(BoardImage, mediaInfo); // Create an instance of BoardImage entity class
      }
      // 4. 엘라스틱 서치에 데이터 추가
      this.boardElasticSearch.insertBoard(
        boardInfo,
        boardInfo.boardCommercial,
        boardInfo.boardAuction,
      );
      await queryRunner.commitTransaction();
      return boardInfo;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  /**
   * 게시판 조회
   * @param userIdx 유저인덱스
   * @param pageRequest 페이징객체
   * @returns 게시판 목록
   */
  async findAllBoard(
    pageRequest: BoardCategoryPageRequest,
  ): Promise<Page<BoardListDto>> {
    const category = pageRequest.category;
    const orderCriteria = pageRequest.orderCriteria;

    // 조회할 게시글의 카테고리가 market, adoption, auction이 아닌 경우, 가격을 기준으로 정렬을 하려고 하면 오류를 응답한다.
    if (
      !['market', 'adoption', 'auction'].includes(category) &&
      orderCriteria === BoardOrderCriteria.PRICE
    ) {
      throw new UnprocessableEntityException(
        HttpErrorConstants.PRICE_NOT_SPECIFIED,
      );
    }

    //1. 요청받은 카테고리의 게시글들을 불러온다.
    const [boards, totalCount] =
      await this.boardRepository.findAndCountByCategory(
        pageRequest,
        category,
        orderCriteria,
      );

    const result = new Page<BoardListDto>(totalCount, boards, pageRequest);
    //2. 게시글 작성자에 대한 정보(닉네임, 프로필 사진 주소)를 불러온다.
    const usersInfoArr = [];
    for (const board of result.items) {
      const userDetails = await this.findUserInfo(board);
      board.UserInfo = userDetails;
      usersInfoArr.push(board);
    }

    result.items = usersInfoArr;

    switch (pageRequest.category) {
      case BoardVerifyType.MARKET:
      case BoardVerifyType.ADOPTION:
        //3. 게시판 카테고리가 분양 or 중고 마켓이면 해당 데이터를 조회한다.
        const commercialInfoArr = [];
        for (const board of result.items) {
          const commercialInfo = await this.boardCommercialRepository.findOne({
            where: {
              boardIdx: board.idx,
            },
          });
          board.boardCommercial = commercialInfo;
          commercialInfoArr.push(board);
        }
        result.items = commercialInfoArr;
        return result;
      case BoardVerifyType.AUCTION:
        const auctionInfoArr = [];
        for (const board of result.items) {
          const auctionInfo = await this.boardAuctionRepository.findOne({
            where: { boardIdx: board.idx },
          });

          board.boardAuction = auctionInfo;
          auctionInfoArr.push(board);
        }

        // 임시저장글은 목록에서 삭제한다. (!item.boardAuction가 있는 이유는, boardAuction이 null인 게시글의 state를 조회하면 'Cannot read properties of null' 오류가 발생하기 때문)
        result.items = auctionInfoArr.filter(
          (item) => !item.boardAuction || item.boardAuction.state !== 'temp',
        );

        return result;
      default:
        return result;
    }
  }
  /**
   * 게시글 상세 조회
   * @param BoardIdx 게시판 인덱스
   * @returns 게시글 관련 정보 및 미디어(이미지, 영상)
   */
  async findBoard(boardIdx: number, userIdx: number) {
    //1. 게시글 정보를 조회한다.
    const board = await this.boardRepository.findBoadDetailByBoardIdx(boardIdx);
    if (!board) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_BOARD);
    } else if (board.status === 'PRIVATE') {
      throw new NotFoundException(HttpErrorConstants.BOARD_PRIVATE);
    }
    //2. 조회수 처리: 현재는 로그인 되어있는 유저만 카운팅 하고 있습니다. 하루에 1번 로그인된 유저 Idx는 레디스(boardview+boardIdx키)에 저장되고 조회수가 1오릅니다. 레디스는 23:59분에 초기화됩니다.
    if (userIdx !== null || userIdx !== undefined) {
      const key = `boardview${boardIdx}`;
      const redis = this.redisService.getClient();
      const setMembers = await redis.smembers(key); // Redis에서 Set의 모든 멤버 가져오기const boardCommercial = new BoardCommercial();
      if (!setMembers.includes(userIdx.toString())) {
        await redis.sadd(key, userIdx);
        if (setMembers.length === 0) {
          const currentTimestamp = Math.floor(Date.now() / 1000); // 현재 시간의 타임스탬프 (초 단위)
          const endOfDayTimestamp = Math.floor(
            new Date().setHours(23, 59, 59, 999) / 1000,
          ); // 오늘 자정까지의 타임스탬프 (초 단위)
          const ttl = endOfDayTimestamp - currentTimestamp; // 오늘 자정까지 남은 시간 (초 단위)
          await redis.expire(key, ttl);
        }
        const viewCnt = board.view + 1;
        board.view = viewCnt;
        await this.boardRepository
          .createQueryBuilder('board')
          .update(Board)
          .set({ view: viewCnt })
          .where('board.idx = :boardIdx', { boardIdx: boardIdx })
          .execute();
      }
    }
    //3. 글 작성자에 대한 정보를 가지고 온다
    const userDetails = await this.findUserInfo(board);
    board.UserInfo = userDetails;

    //4. 게시글에 따라 추가 테이블 정보를 조회한다.
    switch (board.category) {
      case BoardVerifyType.MARKET:
      case BoardVerifyType.ADOPTION:
        const boardCommercial = await this.boardCommercialRepository.findOne({
          where: {
            boardIdx: boardIdx,
          },
        });
        board.boardCommercial = boardCommercial;
        if (userIdx !== null || userIdx !== undefined) {
          this.clientRecommend.saveInterest(
            userIdx,
            board.boardCommercial.pattern,
          );
        }
        return board;
      case BoardVerifyType.AUCTION:
        //경매 보드 추가
        const boardAuction = await this.boardAuctionRepository.findOne({
          where: {
            boardIdx: boardIdx,
          },
        });
        board.boardAuction = boardAuction;

        //라이브 스트림 추가
        const liveStream = await this.liveStreamRepository.findOne({
          where: {
            boardIdx: boardIdx,
          },
        });
        board.liveStream = liveStream;
        if (userIdx !== null || userIdx !== undefined) {
          this.clientRecommend.saveInterest(
            userIdx,
            board.boardAuction.pattern,
          );
        }
        return board;
      default:
        return board;
    }
  }
  /**
   * 게시판 삭제
   * @param boardIdx 게시판 인덱스
   */
  async removeBoard(boardIdx: number, userIdx: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const board = await this.boardRepository.findOne({
        where: {
          idx: boardIdx,
        },
        relations: ['images'],
      });

      if (!board) {
        throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_BOARD);
      } else if (board.userIdx != userIdx) {
        throw new NotFoundException(HttpErrorConstants.BOARD_NOT_WRITER);
      }
      //댓글 보드 상태 변경
      const boardComments = await this.commentRepository.find({
        where: { boardIdx: board.idx },
      });
      if (boardComments.length > 0) {
        for (const boardComment of boardComments) {
          boardComment.boardState = 'deleted';
        }
        await this.commentRepository.save(boardComments);
      }
      //대댓글 보드 상태 변경
      const boardReplys = await this.replyRepository.find({
        where: { boardIdx: board.idx },
      });
      if (boardReplys.length > 0) {
        for (const boardReply of boardReplys) {
          boardReply.boardState = 'deleted';
        }
        await this.replyRepository.save(boardReplys);
      }
      if (await this.isCommercialCate(board.category)) {
        //게시판이 분양 or 중고 마켓일 경우 해당 데이터 테이블 삭제하는 함수
        await queryRunner.manager.softDelete(BoardCommercial, {
          boardIdx: boardIdx,
        });
      }
      if (await this.isAuctionCate(board.category)) {
        //게시판이 경매일 경우 해당 데이터 테이블 삭제하는 함수
        await queryRunner.manager.softDelete(BoardAuction, {
          boardIdx: boardIdx,
        });
      }
      // 게시판 이미지 같이 삭제
      if (board.images) {
        for (const image of board.images) {
          await queryRunner.manager.softRemove(BoardImage, image);
        }
      }
      await queryRunner.manager.softDelete(Board, boardIdx);
      await this.boardElasticSearch.deleteBoard(boardIdx);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async deleteBoardImages(images: BoardImage[]): Promise<void> {
    for (const image of images) {
      this.boardImageRepository.softRemove(image);
    }
  }
  /**
   * 게시글 수정
   * @param diaryIdx 다이어리 인덱스
   * @param dto UpdateDiaryDto
   * @returns
   */
  async updateBoard(
    boardIdx: number,
    dto: UpdateBoardDto,
    @AuthUser() user: User,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let boardCommercial;
      let boardAuction;
      // 1. 수정할 게시글이 존재하는지 확인
      const board = await this.boardRepository.findOne({
        where: {
          idx: boardIdx,
        },
        relations: ['images'],
      });

      if (!board) {
        throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_BOARD);
      }
      // 2. 만약 커머셜(중고, 분양) 테이블이 존제하면 커머셜 테이블 수정
      if (await this.isCommercialCate(board.category)) {
        boardCommercial = BoardCommercial.updateFrom(
          dto.boardCommercialIdx,
          boardIdx,
          dto.gender,
          dto.price,
          dto.size,
          dto.variety,
          dto.pattern,
          dto.birthDate,
          dto.state,
        );
        await queryRunner.manager.save(boardCommercial);
      }
      // 3. 만약 경매 테이블이 존제하면 경매 테이블 수정
      if (await this.isAuctionCate(dto.category)) {
        const auctionInfo = await queryRunner.manager.findOneBy(BoardAuction, {
          idx: dto.auctionIdx,
        });
        boardAuction = BoardAuction.updateForm(
          auctionInfo.idx,
          board.idx,
          dto.price,
          dto.startPrice,
          dto.unit,
          dto.extensionRule,
          dto.gender,
          dto.size,
          dto.variety,
          dto.pattern,
          dto.birthDate,
          dto.state,
          dto.streamKey,
        );
        // 경매 추가 시간 -> 마감 시간이 22:00:59에 끝난다면 22:00:00 부터 ~ 마감 시간 전까지 1명당 1분씩 마감시간이 미뤄지는 시스템
        boardAuction.extensionTime = dto.endTime;
        // 경매 마감 시간
        boardAuction.endTime = moment(dto.endTime)
          .add(1, 'minute')
          .format('YYYY-MM-DD HH:mm');
        if (dto.alertTime !== 'noAlert') {
          boardAuction.alertTime = moment(dto.endTime)
            .subtract(dto.alertTime, 'minute')
            .format('YYYY-MM-DD HH:mm');
        }
        await queryRunner.manager.save(boardAuction);
      }
      const firstImgData = await queryRunner.manager.findOneBy(BoardImage, {
        boardIdx: boardIdx,
        mediaSequence: 0,
      });
      // 4.boardImg 테이블의 첫 이미지 or 영상 커버를 썸네일로 수정
      if (firstImgData !== null) {
      }
      const thumbnailUrl =
        firstImgData !== null
          ? firstImgData.category === 'video'
            ? firstImgData.coverImgPath
            : firstImgData.path
          : null;
      // 5.board 테이블 최종 수정
      const boardInfo = Board.updateFrom(
        user.idx,
        dto.category,
        boardIdx,
        dto.title,
        dto.description,
        thumbnailUrl,
      );
      await queryRunner.manager.save(boardInfo);
      const returnBoard = await this.boardRepository.findOne({
        where: {
          idx: boardIdx,
        },
        relations: ['images'],
      });
      // 6.엘라스틱 서치에서 수정
      await this.boardElasticSearch.updateBoard(
        boardIdx,
        boardInfo,
        boardCommercial,
        boardAuction,
      );
      await queryRunner.commitTransaction();
      return returnBoard;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 경매게시글 스트림키 수정
   * @param dto UpdateStreamKeyDto
   * @returns
   */
  async updateStreamKey(boardAuctionIdx: number, dto: UpdateStreamKeyDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const boardAuction = await this.boardAuctionRepository.findOne({
        where: {
          idx: boardAuctionIdx,
        },
      });

      if (!boardAuction) {
        throw new NotFoundException(
          HttpErrorConstants.CANNOT_FIND_AUCTION_BOARD,
        );
      }

      boardAuction.streamKey = dto.streamKey;

      const updatedBoardAuction = await queryRunner.manager.save(boardAuction);

      await queryRunner.commitTransaction();

      return updatedBoardAuction.streamKey;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 댓글 이미지 업로드(영상x, 이미지만 1장 제한)
   * @param file 이미지 파일
   */
  async createComment(
    dto: CommentDto,
    userIdx: number,
    file: Express.Multer.File,
  ): Promise<Comment> {
    fileValidate(file);
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      let commentInfo;
      //1.댓글일 때
      if (dto.category === BoardVerifyType.COMMENT) {
        const comment = Comment.from(dto);
        comment.userIdx = userIdx;
        if (file) {
          const url = await mediaUpload(file, S3FolderName.REPLY);
          comment.filePath = url;
        }
        commentInfo = await queryRunner.manager.save(comment);
      } else if (dto.category === BoardVerifyType.REPLY) {
        //2. 답글일 때에는, 댓글idx가 필요하다.
        const reply = BoardReply.from(dto);
        reply.userIdx = userIdx;
        if (file) {
          const url = await mediaUpload(file, S3FolderName.REPLY);
          reply.filePath = url;
        }
        commentInfo = await queryRunner.manager.save(reply);
        //2-2. 댓글은 replyCnt 컬럼이 있기 때문에, 답글 수 계산 후에 업데이트
        const count = await this.countComment(
          'reply',
          dto.commentIdx,
          queryRunner,
        );
        await this.commentRepository.updateReplyCnt(dto.commentIdx, count);
      }
      const count = await this.countComment('all', dto.boardIdx, queryRunner);
      this.boardRepository.updateReplyCnt(dto.boardIdx, count);
      await queryRunner.commitTransaction();
      return commentInfo;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async removeComment(
    commentIdx: number,
    boardIdx: number,
    userIdx: number,
    category: string,
  ): Promise<number> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (category === 'comment') {
        const comment = await this.commentRepository.findOne({
          where: {
            idx: commentIdx,
          },
        });
        if (!comment) {
          throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_REPLY);
        }
        if (comment.userIdx != userIdx) {
          throw new NotFoundException(HttpErrorConstants.REPLY_NOT_WRITER);
        }
        await queryRunner.manager.softDelete(BoardComment, commentIdx);
      } else if (category === 'reply') {
        const rerelpy = await this.replyRepository.findOne({
          where: {
            idx: commentIdx,
          },
        });
        if (!rerelpy) {
          throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_REPLY);
        } else if (rerelpy.userIdx != userIdx) {
          throw new NotFoundException(HttpErrorConstants.REPLY_NOT_WRITER);
        }
        await queryRunner.manager.softDelete(BoardReply, commentIdx);
      }
      const count = await this.countComment('all', boardIdx, queryRunner);
      await this.boardRepository.updateReplyCnt(boardIdx, count);
      await queryRunner.commitTransaction();
      return count;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async countComment(
    table: string,
    boardIdx: number,
    queryRunner: QueryRunner,
  ): Promise<number> {
    if (table === 'comment') {
      const replyCnt = await queryRunner.manager.count(BoardComment, {
        where: {
          boardIdx: boardIdx,
        },
      });
      return replyCnt;
    } else if (table === 'reply') {
      const replyCnt = await queryRunner.manager.count(BoardReply, {
        where: {
          commentIdx: boardIdx,
        },
      });
      return replyCnt;
    } else if (table === 'all') {
      const commentCnt = await queryRunner.manager.count(BoardComment, {
        where: {
          boardIdx: boardIdx,
        },
      });
      const replyCnt = await queryRunner.manager.count(BoardReply, {
        where: {
          boardIdx: boardIdx,
        },
      });
      const result = replyCnt + commentCnt;
      return result;
    }
  }
  /**
   * 게시글에 달린 댓글 조회
   * @param pageRequest 페이징객체
   * @returns 댓글 목록
   */
  async findBoardComment(
    pageRequest: PageRequest,
    boardIdx: number,
    category: string,
  ): Promise<Page<BoardComment> | Page<BoardReply>> {
    if (category === 'comment') {
      const [comments, totalCount] =
        await this.commentRepository.findAndCountByBoardIdx(
          pageRequest,
          boardIdx,
        );
      const result = new Page<BoardComment>(totalCount, comments, pageRequest);
      const commentData = [];
      for (const reply of result.items) {
        const userDetails = await this.findUserInfo(reply);
        reply.UserInfo = userDetails;
        commentData.push(reply);
      }
      result.items = commentData;
      return result;
    } else if (category === 'reply') {
      //1. 답글에 대한 정보와 조회한 답글 수를 가져온다.
      const [replys, totalCount] =
        await this.replyRepository.findAndCountByBoardIdx(
          pageRequest,
          boardIdx,
        );
      const result = new Page<BoardReply>(totalCount, replys, pageRequest);
      const commentData = [];
      //2. 답글 작성자 정보를 조회한다.
      for (const reply of result.items) {
        const userDetails = await this.findUserInfo(reply);
        reply.UserInfo = userDetails;
        commentData.push(reply);
      }
      result.items = commentData;
      return result;
    }
  }
  /**
   * 게시글에 달린 댓글 수정
   * @param pageRequest 페이징객체
   * @returns 댓글 목록
   */
  async updateComment(
    dto: CommentDto,
    commentIdx: number,
    userIdx: number,
    file: Express.Multer.File,
  ): Promise<Comment | BoardReply> {
    fileValidate(file);
    if (dto.category === BoardVerifyType.COMMENT) {
      const comment = await this.commentRepository.findOne({
        where: {
          idx: commentIdx,
        },
      });
      if (!comment) {
        throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_REPLY);
      } else if (comment.userIdx != userIdx) {
        throw new NotFoundException(HttpErrorConstants.REPLY_NOT_WRITER);
      }
      comment.description = dto.description;
      if (file) {
        const url = await mediaUpload(file, S3FolderName.REPLY);
        comment.filePath = url;
      }
      const commentInfo = await this.commentRepository.save(comment);
      return commentInfo;
    } else if (dto.category === BoardVerifyType.REPLY) {
      const reply = await this.replyRepository.findOne({
        where: {
          idx: commentIdx,
        },
      });
      if (!reply) {
        throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_REPLY);
      } else if (reply.userIdx != userIdx) {
        throw new NotFoundException(HttpErrorConstants.REPLY_NOT_WRITER);
      }
      reply.description = dto.description;
      if (file) {
        const url = await mediaUpload(file, S3FolderName.REPLY);
        reply.filePath = url;
      }
      const replyInfo = await this.replyRepository.save(reply);
      return replyInfo;
    }
  }

  async RegisterBoardBookmark(
    boardIdx: number,
    userIdx: number,
    category: string,
  ) {
    const board = await this.boardRepository.findOne({
      where: {
        idx: boardIdx,
      },
    });

    if (!board) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_BOARD);
    }
    const bookmark = new Bookmark();
    bookmark.category = category;
    bookmark.userIdx = userIdx;
    bookmark.postIdx = boardIdx;

    const bookmarkCheck = await this.boardBookmarkRepository.findOne({
      where: {
        category: category,
        postIdx: boardIdx,
        userIdx: userIdx,
      },
    });
    if (bookmarkCheck) {
      throw new NotFoundException(HttpErrorConstants.BOOKMAEK_EXIST);
    }
    const result = await this.boardBookmarkRepository.save(bookmark);
    return result;
  }
  async boardBookmarkRemove(boardIdx: number, userIdx: number) {
    const bookmarkCheck = await this.boardBookmarkRepository.findOne({
      where: {
        category: 'board',
        postIdx: boardIdx,
        userIdx: userIdx,
      },
    });
    if (!bookmarkCheck) {
      throw new NotFoundException(HttpErrorConstants.BOOKMAEK_NOT_EXIST);
    }
    const result = await this.boardBookmarkRepository.softDelete(
      bookmarkCheck.idx,
    );
    return result;
  }
  // 유저 정보 찾기
  findUserInfo = async (result) => {
    const userInfo = await this.userRepository.findOne({
      where: {
        idx: result.userIdx,
      },
    });
    const userDetails = {
      idx: userInfo.idx,
      nickname: userInfo.nickname,
      profilePath: userInfo.profilePath,
    };
    return userDetails;
  };
  async isCommercialCate(category: string) {
    if (
      category === BoardVerifyType.ADOPTION ||
      category === BoardVerifyType.MARKET
    ) {
      return true;
    } else {
      return false;
    }
  }
  // 옥션 카테고리인지 아닌지
  async isAuctionCate(category: string): Promise<boolean> {
    if (category === BoardVerifyType.AUCTION) {
      return true;
    } else {
      return false;
    }
  }
  // 분양 게시글 추천 해주는 항목
  async findRecommendItem(userIdx: number): Promise<BoardListDto[]> {
    let result = null;
    const recommend = await this.clientRecommend.recommendCategory(userIdx);
    const recommendItem = recommend[0].recommendItem;
    if (recommendItem.length !== 0) {
      const resultItem = [];
      // 추천할 카테고리를 받은 뒤, 해당 카테고리별 추천할 개수만큼 조회함
      for (const item of recommendItem) {
        const result = await this.boardCommercialRepository.findRecommendItem(
          item.category,
          item.recommendCnt,
        );
        resultItem.push(result);
      }
      // 추천된 게시글 개수
      const itemsCnt = resultItem.reduce(
        (count, subArray) => count + subArray.length,
        0,
      );
      //기본적인 추천 게시글의 개수는 5개인데, 추천해야 하는 카테고리에 판매중인 상품이 없거나 부족할 때에는 현재 판매중인 게시글 중, 조회수가 높은 순으로 추천합니다.
      if (itemsCnt < 4) {
        // 더 가져와야 하는 아이템 개수
        const extraItemsCnt = 5 - itemsCnt;
        const resultdata = await this.boardCommercialRepository.findExtraItems(
          extraItemsCnt,
        );
        resultItem.push(resultdata);
      }
      // 데이터 정렬
      result = resultItem.flatMap((group) =>
        group.map((boardCommercial) => ({
          boardCommercialIdx: boardCommercial.idx,
          createdAt: boardCommercial.createdAt,
          updatedAt: boardCommercial.updatedAt,
          deletedAt: boardCommercial.deletedAt,
          boardIdx: boardCommercial.boardIdx,
          price: boardCommercial.price,
          gender: boardCommercial.gender,
          size: boardCommercial.size,
          variety: boardCommercial.variety,
          state: boardCommercial.state,
          pattern: boardCommercial.pattern,
          birthDate: boardCommercial.birthDate,
          board: boardCommercial.board,
          user: boardCommercial.user,
        })),
      );
    }
    return result;
  }
  async searchTotal(keyword: string) {
    return this.boardElasticSearch.searchTotal(keyword);
  }
  async searchCategory(keyword: string, pageRequest: BoardCategoryPageRequest) {
    return this.boardElasticSearch.searchCategory(keyword, pageRequest);
  }
}
