import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { BoardRepository } from '../board/repositories/board.repository';
import { BoardListDto } from '../board/dtos/board-list.dto';
import { Page, PageRequest } from 'src/core/page';
import { BoardCategoryPageRequest } from '../board/dtos/board-category-page';
import { BoardCommercialRepository } from '../board/repositories/board-commercial.repository';
import { BoardAuctionRepository } from '../board/repositories/board-auction.repository';
import BoardComment from '../board/entities/board-comment.entity';
import { DataSource } from 'typeorm';
import { ChatConversationRepository } from './repositories/chat-conversation.repository';
import { ChatConversation } from './entities/chat-conversation.entity';
import { Bookmark } from '../board/entities/board-bookmark.entity';
import { BoardBookmarkRepository } from '../board/repositories/board-bookmark.repository';
@Injectable()
export class MypageService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private boardRepository: BoardRepository,
    private boardCommercialRepository: BoardCommercialRepository,
    private boardAuctionRepository: BoardAuctionRepository,
    private chatConversationRepository: ChatConversationRepository,
    private boardBookmarkRepository: BoardBookmarkRepository,
    private dataSource: DataSource,
  ) {}
  /**
   * 게시판 다중 파일 업로드
   * @param files 파일들
   */
  async findBoard(
    user: User,
    pageRequest: PageRequest,
  ): Promise<Page<BoardListDto>> {
    //1. 게시글에 대한 정보를 불러온다.
    const [boards, totalCount] =
      await this.boardRepository.findAndCountByUserIdx(user.idx, pageRequest);
    const result = new Page<BoardListDto>(totalCount, boards, pageRequest);
    return result;
  }
  /**
   * 내가 작성한 댓글 조회
   */
  async findReply(
    user: User,
    pageRequest: PageRequest,
  ): Promise<Page<BoardComment>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const totalQuery = `
        SELECT COUNT(*) AS total_count
        FROM (
            SELECT idx, category, board_idx, file_path, user_idx, description, created_at, updated_at, deleted_at
            FROM iot_project.board_reply
            WHERE user_idx = ? AND board_state = 'public'
            UNION ALL
            SELECT idx, category, board_idx, file_path, user_idx, description, created_at, updated_at, deleted_at
            FROM iot_project.board_comment
            WHERE user_idx = ? AND board_state = 'public'
        ) AS user_activity;
      `;
      const totalCount = await queryRunner.query(totalQuery, [
        user.idx,
        user.idx,
      ]);
      const getDataQuery = `
        SELECT idx, category, board_idx, file_path, user_idx, description, created_at, updated_at, deleted_at
        FROM iot_project.board_reply
        WHERE user_idx = ? AND board_state = 'public'
        UNION ALL
        SELECT idx, category, board_idx, file_path, user_idx, description, created_at, updated_at, deleted_at
        FROM iot_project.board_comment
        WHERE user_idx = ? AND board_state = 'public'
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?;
      `;
      //조회 데이터
      const userActivities = await queryRunner.query(getDataQuery, [
        user.idx,
        user.idx,
        pageRequest.limit,
        pageRequest.offset,
      ]);
      //게시판 정보 담고 리턴할 데이터
      const returnData: BoardComment[] = [];
      for (const data of userActivities) {
        const boardComment = BoardComment.myPage(data);
        const board = await this.boardRepository.findOne({
          where: {
            idx: data.board_idx,
          },
        });
        if (board !== null) {
          boardComment.title = board.title;
          returnData.push(boardComment);
        }
      }
      const result = new Page<BoardComment>(
        totalCount[0].total_count,
        returnData,
        pageRequest,
      );
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async findMyAuction(
    user: User,
    pageRequest: BoardCategoryPageRequest,
  ): Promise<Page<BoardListDto>> {
    //1. 게시글에 대한 정보를 불러온다.
    const [boards, totalCount] =
      await this.boardRepository.findAndCountByAuctionMyPage(
        pageRequest,
        user.idx,
      );
    const result = new Page<BoardListDto>(totalCount, boards, pageRequest);
    //2. 게시글 작성자에 대한 정보(닉네임, 프로필 사진 주소)를 불러온다.
    const usersInfoArr = [];
    for (const board of result.items) {
      const userDetails = {
        idx: user.idx,
        nickname: user.nickname,
        profilePath: user.profilePath,
      };
      board.UserInfo = userDetails;
      usersInfoArr.push(board);
    }
    result.items = usersInfoArr;

    const actionInfoArr = [];
    for (const board of result.items) {
      const actionInfo = await this.boardAuctionRepository.findOne({
        where: {
          boardIdx: board.idx,
          state: 'selling',
        },
      });
      board.boardAuction = actionInfo;
      actionInfoArr.push(board);
    }
    result.items = actionInfoArr;
    return result;
  }
  async findMyBidding(
    user: User,
    pageRequest: PageRequest,
  ): Promise<Page<ChatConversation>> {
    const [datas, totalCount] = await this.chatConversationRepository.findMyBid(
      pageRequest,
      user.idx,
    );
    const result = new Page<ChatConversation>(totalCount, datas, pageRequest);
    return result;
  }
  async findBookMark(
    user: User,
    pageRequest: PageRequest,
    category: string,
  ): Promise<Page<Bookmark>> {
    const [datas, totalCount] = await this.boardBookmarkRepository.findMyBid(
      pageRequest,
      user.idx,
      category,
    );
    const result = new Page<Bookmark>(totalCount, datas, pageRequest);
    return result;
  }
}
