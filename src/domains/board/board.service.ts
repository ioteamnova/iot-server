import { Injectable } from '@nestjs/common';
import { createBoardDto } from './dtos/create-board.dto';
import DateUtils from 'src/utils/date-utils';
import * as uuid from 'uuid';
import { S3FolderName, asyncUploadToS3 } from 'src/utils/s3-utils';
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
   * @returns 이미지 엔티티
   */
  async createBoard(
    dto: createBoardDto,
    userIdx: number,
    files: Array<Express.Multer.File>,
  ) {
    dto.userIdx = userIdx;
    const board = Board.from(dto);
    const BoardInfo = await this.boardRepository.save(board);

    if (files) {
      console.log('BoardInfo:::', BoardInfo);
      const images = await this.uploadBoardImages(files, BoardInfo.idx);
    }

    return BoardInfo;
  }
  /**
   * 이미지 업로드
   * @param file 이미지파일
   * @returns 이미지 s3 url
   */
  async uploadImageToS3(file: Express.Multer.File, folder: string) {
    const fileName = `${DateUtils.momentFile()}-${uuid.v4()}-${
      file.originalname
    }`;
    const fileKey = `${folder}/${fileName}`;
    const result = await asyncUploadToS3(fileKey, file.buffer);
    return result.Location;
  }

  async uploadBoardImages(
    files: Express.Multer.File[],
    boardIdx: number,
  ): Promise<BoardImage[]> {
    const images: BoardImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await this.uploadImageToS3(files[i], S3FolderName.DIARY);
      const image = new BoardImage();
      image.board_idx = boardIdx;
      image.media_sequence = i;
      image.category = 'img';
      image.Path = url;
      images.push(image);
    }
    await this.boardImageRepository.save(images);
    return images;
  }
}
