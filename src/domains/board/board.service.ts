import { Injectable } from '@nestjs/common';
import { createBoardDto } from './dtos/create-board.dto';
import { S3FolderName, mediaUpload } from 'src/utils/s3-utils';
import { BoardRepository } from './repositories/create-Board.repository';
import { BoardImage } from './entities/board-image.entity';
import { BoardImageRepository } from './repositories/board-image.repository';
import { Board } from './entities/board.entity';

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
}
