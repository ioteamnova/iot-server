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
import { ReplyDto } from './dtos/reply.dto';
import Reply from './entities/board-reply.entity';
import { BoardReplyRepository } from './repositories/board-reply.repository';
import { BoardImageRepository } from './repositories/board-image.repository';
import { IsNull, Not } from 'typeorm';
import BoardReply from './entities/board-reply.entity';

@Injectable()
export class BoardService {
  constructor(
    private boardRepository: BoardRepository,
    private boardImageRepository: BoardImageRepository,
    private replyRepository: BoardReplyRepository,
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
  ): Promise<Page<Board>> {
    const [boards, totalCount] =
      await this.boardRepository.findAndCountByCategory(pageRequest, category);
    console.log(boards);
    return new Page<Board>(totalCount, boards, pageRequest);
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
    console.log(board);
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
   * 다이어리 수정
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
  async createReply(dto: ReplyDto, userIdx: number, file: Express.Multer.File) {
    const reply = Reply.from(dto);
    reply.userIdx = userIdx;
    if (file) {
      const url = await mediaUpload(file, S3FolderName.REPLY);
      reply.filePath = url;
    }
    const replyInfo = await this.replyRepository.save(reply);
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
    const count = await this.countReply('reply', boardIdx);
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
          deletedAt: Not(IsNull()),
        },
      });
      return replyCnt;
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
    console.log(replys);
    return new Page<Reply>(totalCount, replys, pageRequest);
  }
}
