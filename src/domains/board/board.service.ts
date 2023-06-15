import { Injectable, NotFoundException } from '@nestjs/common';
import { createBoardDto } from './dtos/create-board.dto';
import { S3FolderName, mediaUpload } from 'src/utils/s3-utils';
import { BoardRepository } from './repositories/board.repository';
import { BoardImage } from './entities/board-image.entity';
import { Board } from './entities/board.entity';
import { Page, PageRequest } from 'src/core/page';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { UpdateBoardDto } from './dtos/update-diary.dto';
import AuthUser from 'src/core/decorators/auth-user.decorator';
import { User } from 'src/domains/user/entities/user.entity';
import { ReplyDto, RereplyDto } from './dtos/reply.dto';
import Reply from './entities/board-reply.entity';
import Rereply from './entities/board-rereply.entity';
import { BoardReplyRepository } from './repositories/board-reply.repository';
import { BoardImageRepository } from './repositories/board-image.repository';
import BoardReply from './entities/board-reply.entity';
import BoardRereply from './entities/board-rereply.entity';
import { BoardRereplyRepository } from './repositories/board-rereply.repository';
import { BoardBookmarkRepository } from './repositories/board-bookmark.repository';
import { Bookmark } from './entities/board-bookmark.entity';
import { BoardCommercial } from './entities/board-commercial.entity';
import { BoardCommercialRepository } from './repositories/board-commercial.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { BoardListDto } from './dtos/board-list.dto';

@Injectable()
export class BoardService {
  constructor(
    private boardRepository: BoardRepository,
    private userRepository: UserRepository,
    private boardImageRepository: BoardImageRepository,
    private replyRepository: BoardReplyRepository,
    private rereplyRepository: BoardRereplyRepository,
    private boardBookmarkRepository: BoardBookmarkRepository,
    private boardCommercialRepository: BoardCommercialRepository,
  ) {}
  /**
   * 게시판 다중 이미지 업로드
   * @param files 파일들
   */
  async createBoard(
    dto: createBoardDto,
    userIdx: number,
    files: Array<Express.Multer.File>,
  ) {
    dto.userIdx = userIdx;
    const board = Board.from(dto);
    const boardInfo = await this.boardRepository.save(board);

    if (board.category == 'adoption' || board.category == 'market') {
      const boardCommercial = new BoardCommercial();
      boardCommercial.boardIdx = boardInfo.idx;
      boardCommercial.gender = dto.gender;
      boardCommercial.price = dto.price;
      boardCommercial.size = dto.size;
      boardCommercial.variety = dto.variety;
      const result = await this.boardCommercialRepository.save(boardCommercial);
    }

    if (files) {
      await this.uploadBoardImages(files, boardInfo.idx);
    }
    return boardInfo;
  }
  /**
   * 게시판 조회
   * @param userIdx 유저인덱스
   * @param pageRequest 페이징객체
   * @returns 게시판 목록
   */
  async findAllBoard(
    pageRequest: PageRequest,
    category: string,
  ): Promise<Page<BoardListDto>> {
    //1. 게시글에 대한 정보를 불러온다.
    const [boards, totalCount] =
      await this.boardRepository.findAndCountByCategory(pageRequest, category);
    const result = new Page<BoardListDto>(totalCount, boards, pageRequest);
    //2. 게시글 작성자에 대한 정보(닉네임, 프로필 사진 주소)를 불러온다.
    const usersInfoArr = [];
    for (const board of result.items) {
      const userInfo = await this.userRepository.findOne({
        where: {
          idx: board.userIdx,
        },
      });
      const userDetails = {
        idx: userInfo.idx,
        nickname: userInfo.nickname,
        profilePath: userInfo.profilePath,
      };
      board.UsersInfo = userDetails;
      usersInfoArr.push(board);
    }
    result.items = usersInfoArr;
    if (category == 'adoption' || category == 'market') {
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
    }
    return result;
  }

  /**
   * 이미지 업로드
   * @param file 이미지파일
   * @returns 이미지 s3 url
   */

  async uploadBoardImages(
    files: Express.Multer.File[],
    boardIdx: number,
  ): Promise<BoardImage[]> {
    const images: BoardImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await mediaUpload(files[i], S3FolderName.BOARD);
      const image = new BoardImage();
      image.boardIdx = boardIdx;
      image.mediaSequence = i;
      image.category = 'img';
      image.path = url;
      images.push(image);
    }
    await this.boardImageRepository.save(images);
    return images;
  }
  /**
   * 게시글 상세 조회
   * @param BoardIdx 게시판 인덱스
   * @returns 게시글 관련 정보 및 미디어(이미지, 영상)
   */
  async findDiary(boardIdx: number) {
    const board = await this.boardRepository.findBoadDetailByBoardIdx(boardIdx);
    if (!board) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_BOARD);
    } else if (board.status == 'PRIVATE') {
      throw new NotFoundException(HttpErrorConstants.BOARD_PRIVATE);
    }
    return board;
  }
  /**
   * 게시판 삭제
   * @param diaryIdx 게시판 인덱스
   */
  async removeBoard(boardIdx: number, userIdx: number): Promise<void> {
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
    if (board.category == 'adoption' || board.category == 'market') {
      //게시판이 분양 or 중고 마켓일 경우 해당 데이터 테이블 삭제하는 함수
      this.boardCommercialRepository.softDelete({ boardIdx: boardIdx });
    }
    // 게시판 이미지 같이 삭제
    if (board.images) {
      this.deleteBoardImages(board.images);
    }
    this.boardRepository.softDelete(boardIdx);
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
    files: Array<Express.Multer.File>,
  ) {
    const deleteArr = dto.deleteIdxArr;
    const modifySqenceArr = dto.modifySqenceArr;
    const fileIdxArr = dto.FileIdx;
    for (let i = 0; i < deleteArr.length; i++) {
      // 기존 이미지 삭제
      await this.boardImageRepository.softDelete(deleteArr[i]);
    }
    const board = await this.boardRepository.findOne({
      where: {
        idx: boardIdx,
      },
      relations: ['images'],
    });

    if (!board) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_BOARD);
    }
    if (board.category == 'adoption' || board.category == 'market') {
      const boardCommercial = new BoardCommercial();
      boardCommercial.idx = dto.boardCommercialIdx;
      boardCommercial.boardIdx = boardIdx;
      boardCommercial.gender = dto.gender;
      boardCommercial.price = dto.price;
      boardCommercial.size = dto.size;
      boardCommercial.variety = dto.variety;
      console.log('boardCommercial', boardCommercial);
      const result = await this.boardCommercialRepository.save(boardCommercial);
    }

    for (let i = 0; i < modifySqenceArr.length; i++) {
      //미디어 순서(media_squence) 바꾸는 코드
      for (let j = 0; j < board.images.length; j++) {
        if (modifySqenceArr[i] == board.images[j].mediaSequence) {
          //기존 이미지 인덱스 수정
          board.images[j].mediaSequence = i;
          await this.boardImageRepository.save(board.images[j]);
          break;
        } else if (files && j == board.images.length - 1) {
          const url = await mediaUpload(
            files[fileIdxArr.lastIndexOf(modifySqenceArr[i])],
            S3FolderName.BOARD,
          );
          const image = new BoardImage();
          image.boardIdx = boardIdx;
          image.mediaSequence = i;
          image.category = 'img';
          image.path = url;
          await this.boardImageRepository.save(image);
        }
      }
    }
    const boardInfo = new Board();
    boardInfo.userIdx = user.idx;
    boardInfo.category = dto.category;
    boardInfo.idx = boardIdx;
    boardInfo.title = dto.title;
    boardInfo.description = dto.description;
    await this.boardRepository.save(boardInfo);
    const returnBoard = await this.boardRepository.findOne({
      where: {
        idx: boardIdx,
      },
      relations: ['images'],
    });
    return returnBoard;
  }
  /**
   * 댓글 이미지 업로드(영상x, 이미지만 1장 제한)
   * @param file 이미지 파일
   */
  async createReply(
    dto: ReplyDto,
    userIdx: number,
    file: Express.Multer.File,
  ): Promise<Reply> {
    const reply = Reply.from(dto);
    reply.userIdx = userIdx;
    if (file) {
      const url = await mediaUpload(file, S3FolderName.REPLY);
      reply.filePath = url;
    }
    const replyInfo = await this.replyRepository.save(reply);
    const count = await this.countReply('all', dto.boardIdx);
    await this.boardRepository.updateReplyCnt(dto.boardIdx, count);
    return replyInfo;
  }
  async removeReply(
    replyIdx: number,
    boardIdx: number,
    userIdx: number,
  ): Promise<number> {
    const relpy = await this.replyRepository.findOne({
      where: {
        idx: replyIdx,
      },
    });

    if (!relpy) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_REPLY);
    } else if (relpy.userIdx != userIdx) {
      throw new NotFoundException(HttpErrorConstants.REPLY_NOT_WRITER);
    }
    await this.replyRepository.softDelete(replyIdx);
    const count = await this.countReply('all', boardIdx);
    await this.boardRepository.updateReplyCnt(boardIdx, count);
    return count;
  }
  async countReply(table: string, boardIdx: number): Promise<number> {
    if (table == 'reply') {
      const replyCnt = await this.replyRepository.count({
        where: {
          boardIdx: boardIdx,
        },
      });
      return replyCnt;
    } else if (table == 'rereply') {
      const replyCnt = await this.replyRepository.count({
        where: {
          boardIdx: boardIdx,
        },
      });
      return replyCnt;
    } else if (table == 'all') {
      const replyCnt = await this.replyRepository.count({
        where: {
          boardIdx: boardIdx,
        },
      });
      const rereplyCnt = await this.rereplyRepository.count({
        where: {
          boardIdx: boardIdx,
        },
      });
      const result = replyCnt + rereplyCnt;
      return result;
    }
  }
  /**
   * 게시글에 달린 댓글 조회
   * @param pageRequest 페이징객체
   * @returns 댓글 목록
   */
  async findBoardReply(
    pageRequest: PageRequest,
    boardIdx: number,
  ): Promise<Page<BoardReply>> {
    const [replys, totalCount] =
      await this.replyRepository.findAndCountByBoardIdx(pageRequest, boardIdx);
    return new Page<Reply>(totalCount, replys, pageRequest);
  }
  /**
   * 게시글에 달린 댓글 수정
   * @param pageRequest 페이징객체
   * @returns 댓글 목록
   */
  async updateReply(
    dto: ReplyDto,
    replyIdx: number,
    userIdx: number,
    file: Express.Multer.File,
  ): Promise<Reply> {
    const reply = await this.replyRepository.findOne({
      where: {
        idx: replyIdx,
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
  async createRereply(
    dto: RereplyDto,
    userIdx: number,
    file: Express.Multer.File,
  ): Promise<Reply> {
    const rereply = BoardRereply.from(dto);
    rereply.userIdx = userIdx;
    if (file) {
      const url = await mediaUpload(file, S3FolderName.REPLY);
      rereply.filePath = url;
    }
    const count = await this.countReply('all', dto.boardIdx);
    await this.boardRepository.updateReplyCnt(dto.boardIdx, count);
    const replyInfo = await this.rereplyRepository.save(rereply);
    return replyInfo;
  }
  async removeRereply(
    rereplyIdx: number,
    boardIdx: number,
    userIdx: number,
  ): Promise<number> {
    const rerelpy = await this.rereplyRepository.findOne({
      where: {
        idx: rereplyIdx,
      },
    });
    if (!rerelpy) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_REPLY);
    } else if (rerelpy.userIdx != userIdx) {
      throw new NotFoundException(HttpErrorConstants.REPLY_NOT_WRITER);
    }
    await this.rereplyRepository.softDelete(rereplyIdx);
    const count = await this.countReply('rereply', boardIdx);
    await this.boardRepository.updateReplyCnt(boardIdx, count);
    return count;
  }
  async updateRereply(
    dto: RereplyDto,
    rereplyIdx: number,
    userIdx: number,
    file: Express.Multer.File,
  ): Promise<Rereply> {
    const rereply = await this.rereplyRepository.findOne({
      where: {
        idx: rereplyIdx,
      },
    });
    if (!rereply) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_REPLY);
    } else if (rereply.userIdx != userIdx) {
      throw new NotFoundException(HttpErrorConstants.REPLY_NOT_WRITER);
    }
    rereply.description = dto.description;
    if (file) {
      const url = await mediaUpload(file, S3FolderName.REPLY);
      rereply.filePath = url;
    }
    const replyInfo = await this.rereplyRepository.save(rereply);
    return replyInfo;
  }
  /**
   * 댓글에 달린 대댓글 조회
   * @param pageRequest 페이징객체
   * @returns 대댓글 목록
   */
  async findBoardRereply(
    pageRequest: PageRequest,
    replyIdx: number,
  ): Promise<Page<BoardRereply>> {
    const [rereplys, totalCount] =
      await this.rereplyRepository.findAndCountByBoardIdx(
        pageRequest,
        replyIdx,
      );
    return new Page<BoardRereply>(totalCount, rereplys, pageRequest);
  }
  async RegisterBoardBookmark(boardIdx: number, userIdx: number) {
    const board = await this.boardRepository.findOne({
      where: {
        idx: boardIdx,
      },
    });

    if (!board) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_BOARD);
    }
    const bookmark = new Bookmark();
    bookmark.category = 'board';
    bookmark.userIdx = userIdx;
    bookmark.postIdx = boardIdx;

    const bookmarkCheck = await this.boardBookmarkRepository.findOne({
      where: {
        category: 'board',
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
}
