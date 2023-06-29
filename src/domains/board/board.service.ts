import { Injectable, NotFoundException } from '@nestjs/common';
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
import { CommentDto, ReplyDto } from './dtos/board-comment.dto';
import Comment from './entities/board-comment.entity';
import Reply from './entities/board-comment.entity';
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
import { fileValidate, fileValidates } from 'src/utils/fileValitate';
import axios from 'axios';
import * as FormData from 'form-data';

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
    //파일이 존재하면 유효성 검사
    await fileValidates(files);
    dto.userIdx = userIdx;
    const board = Board.from(dto);
    const boardInfo = await this.boardRepository.save(board);

    if (board.category === 'adoption' || board.category === 'market') {
      const boardCommercial = new BoardCommercial();
      boardCommercial.boardIdx = boardInfo.idx;
      boardCommercial.gender = dto.gender;
      boardCommercial.price = dto.price;
      boardCommercial.size = dto.size;
      boardCommercial.variety = dto.variety;
      await this.boardCommercialRepository.save(boardCommercial);
    }

    if (files) {
      try {
        const url = `${process.env.FILE_CONVERTER_IP}/board/upload`;
        const formData = new FormData();
        formData.append('boardIdx', boardInfo.idx.toString());
        formData.append('userIdx', userIdx.toString());
        console.log('files:', files);
        files.forEach((file) => {
          formData.append('files', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
          });
        });
        const response = await axios.post(url, formData, {
          headers: formData.getHeaders(),
        });
        return response.data;
      } catch (error) {
        throw new Error(`Error sending POST request: ${error.message}`);
      }
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
      const userDetails = await this.findUserInfo(board);
      board.UserInfo = userDetails;
      usersInfoArr.push(board);
    }
    result.items = usersInfoArr;
    if (category === 'adoption' || category === 'market') {
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
    fileValidates(files);
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
  async findBoard(boardIdx: number) {
    //1. 게시글 정보를 조회한다.
    const board = await this.boardRepository.findBoadDetailByBoardIdx(boardIdx);
    if (!board) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_BOARD);
    } else if (board.status === 'PRIVATE') {
      throw new NotFoundException(HttpErrorConstants.BOARD_PRIVATE);
    }
    //2. 글 작성자에 대한 정보를 가지고 온다
    const userDetails = await this.findUserInfo(board);
    board.UserInfo = userDetails;
    //3. 게시글에 따라 추가 테이블 정보를 조회한다.
    if (board.category === 'adoption' || board.category === 'market') {
      const boardCommercial = await this.boardCommercialRepository.findOne({
        where: {
          boardIdx: boardIdx,
        },
      });
      board.boardCommercial = boardCommercial;
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
    if (board.category === 'adoption' || board.category === 'market') {
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
    files: Express.Multer.File[],
  ) {
    await fileValidates(files);
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
    if (board.category === 'adoption' || board.category === 'market') {
      const boardCommercial = new BoardCommercial();
      boardCommercial.idx = dto.boardCommercialIdx;
      boardCommercial.boardIdx = boardIdx;
      boardCommercial.gender = dto.gender;
      boardCommercial.price = dto.price;
      boardCommercial.size = dto.size;
      boardCommercial.variety = dto.variety;
      await this.boardCommercialRepository.save(boardCommercial);
    }

    for (let i = 0; i < modifySqenceArr.length; i++) {
      //미디어 순서(media_squence) 바꾸는 코드
      for (let j = 0; j < board.images.length; j++) {
        if (modifySqenceArr[i] === board.images[j].mediaSequence) {
          //기존 이미지 순서 인덱스 수정
          board.images[j].mediaSequence = i;
          await this.boardImageRepository.save(board.images[j]);
          break;
        } else if (files && j === board.images.length - 1) {
          try {
            const getFile = files[fileIdxArr.lastIndexOf(modifySqenceArr[i])];
            const url = `${process.env.FILE_CONVERTER_IP}/board/update`;
            const formData = new FormData();
            formData.append('boardIdx', board.idx.toString());
            formData.append('sequence', i.toString());
            formData.append('file', getFile.buffer, {
              filename: getFile.originalname,
              contentType: getFile.mimetype,
            });
            const response = await axios.post(url, formData, {
              headers: formData.getHeaders(),
            });
            return response.data;
          } catch (error) {
            throw new Error(`Error sending POST request: ${error.message}`);
          }
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
  async createComment(
    dto: CommentDto,
    userIdx: number,
    file: Express.Multer.File,
  ): Promise<Comment> {
    await fileValidate(file);
    const comment = Comment.from(dto);
    comment.userIdx = userIdx;
    if (file) {
      const url = await mediaUpload(file, S3FolderName.REPLY);
      comment.filePath = url;
    }
    const commentInfo = await this.commentRepository.save(comment);
    const count = await this.countComment('all', dto.boardIdx);
    await this.boardRepository.updateReplyCnt(dto.boardIdx, count);
    return commentInfo;
  }
  async removeComment(
    commentIdx: number,
    boardIdx: number,
    userIdx: number,
  ): Promise<number> {
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
    await this.commentRepository.softDelete(commentIdx);
    const count = await this.countComment('all', boardIdx);
    await this.boardRepository.updateReplyCnt(boardIdx, count);
    return count;
  }
  async countComment(table: string, boardIdx: number): Promise<number> {
    if (table === 'comment') {
      const replyCnt = await this.commentRepository.count({
        where: {
          boardIdx: boardIdx,
        },
      });
      return replyCnt;
    } else if (table === 'reply') {
      const replyCnt = await this.replyRepository.count({
        where: {
          boardIdx: boardIdx,
        },
      });
      return replyCnt;
    } else if (table === 'all') {
      const replyCnt = await this.commentRepository.count({
        where: {
          boardIdx: boardIdx,
        },
      });
      const rereplyCnt = await this.replyRepository.count({
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
  async findBoardComment(
    pageRequest: PageRequest,
    boardIdx: number,
  ): Promise<Page<BoardComment>> {
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
  ): Promise<BoardComment> {
    fileValidate(file);
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
  }
  async createReply(
    dto: ReplyDto,
    userIdx: number,
    file: Express.Multer.File,
  ): Promise<Reply> {
    fileValidate(file);
    const reply = BoardReply.from(dto);
    reply.userIdx = userIdx;
    if (file) {
      const url = await mediaUpload(file, S3FolderName.REPLY);
      reply.filePath = url;
    }
    const count = await this.countComment('all', dto.boardIdx);
    await this.boardRepository.updateReplyCnt(dto.boardIdx, count);
    const result = await this.replyRepository.save(reply);

    const userDetails = await this.findUserInfo(result);
    result.UserInfo = userDetails;
    return result;
  }
  async removeReply(
    replyIdx: number,
    boardIdx: number,
    userIdx: number,
  ): Promise<number> {
    const rerelpy = await this.replyRepository.findOne({
      where: {
        idx: replyIdx,
      },
    });
    if (!rerelpy) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_REPLY);
    } else if (rerelpy.userIdx != userIdx) {
      throw new NotFoundException(HttpErrorConstants.REPLY_NOT_WRITER);
    }
    await this.replyRepository.softDelete(replyIdx);
    const count = await this.countComment('reply', boardIdx);
    await this.boardRepository.updateReplyCnt(boardIdx, count);
    return count;
  }
  async updateReply(
    dto: ReplyDto,
    replyIdx: number,
    userIdx: number,
    file: Express.Multer.File,
  ): Promise<Reply> {
    fileValidate(file);
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
  /**
   * 댓글에 달린 대댓글 조회
   * @param pageRequest 페이징객체
   * @returns 대댓글 목록
   */
  async findBoardReply(
    pageRequest: PageRequest,
    commentIdx: number,
  ): Promise<Page<BoardReply>> {
    //1. 답글에 대한 정보와 조회한 답글 수를 가져온다.
    const [replys, totalCount] =
      await this.replyRepository.findAndCountByBoardIdx(
        pageRequest,
        commentIdx,
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
}
