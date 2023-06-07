import { Injectable, NotFoundException } from '@nestjs/common';
import { createBoardDto } from './dtos/create-board.dto';
import { S3FolderName, mediaUpload } from 'src/utils/s3-utils';
import { BoardRepository } from './repositories/board.repository';
import { BoardImage } from './entities/board-image.entity';
import { BoardImageRepository } from './repositories/board-image.repository';
import { Board } from './entities/board.entity';
import { Page, PageRequest } from 'src/core/page';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';

@Injectable()
export class BoardService {
  constructor(
    private boardRepository: BoardRepository,
    private boardImageRepository: BoardImageRepository,
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
   * 반려동물 목록 조회
   * @param userIdx 유저인덱스
   * @param pageRequest 페이징객체
   * @returns 반려동물 목록
   */
  async findAllBoard(pageRequest: PageRequest): Promise<Page<Board>> {
    const [boards, totalCount] =
      await this.boardRepository.findAndCountByCategory(pageRequest);
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
    console.log('board', board);

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
}
