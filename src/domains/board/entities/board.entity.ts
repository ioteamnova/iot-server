import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BoardStatus } from '../board-status.enum';
import { BoardImage } from './board-image.entity';
import { UpdateBoardDto } from '../dtos/update-board.dto';
import { Bookmark } from './board-bookmark.entity';
import { ChatConversation } from 'src/domains/mypage/entities/chat-conversation.entity';

@Entity()
export class Board extends BaseEntity {
  @Column()
  category: string;

  @Column()
  userIdx: number;

  @Column()
  title: string;

  @Column()
  thumbnail: string;

  @Column()
  media: string;

  @Column()
  description: string;

  @Column()
  view: number;

  @Column()
  commentCnt: number;

  @Column()
  status: BoardStatus;

  @OneToMany(() => BoardImage, (image) => image.board)
  images: BoardImage[];

  // 일대일 관계 설정
  @OneToOne(() => Bookmark)
  @JoinColumn({ name: 'idx', referencedColumnName: 'postIdx' }) // idx와 postIdx를 일치시킴
  bookmark: Bookmark;

  @OneToOne(() => ChatConversation)
  @JoinColumn({ name: 'idx', referencedColumnName: 'roomIdx' }) // idx와 postIdx를 일치시킴
  chatConversation: ChatConversation;

  static from({
    userIdx,
    title,
    category,
    description,
  }: {
    userIdx: number;
    title: string;
    category: string;
    description: string;
  }) {
    const board = new Board();
    board.userIdx = userIdx;
    board.title = title;
    board.category = category;
    board.description = description;
    return board;
  }
  static undateFrom(
    userIdx: number,
    category: string,
    idx: number,
    title: string,
    description: string,
  ) {
    const board = new Board();
    board.idx = idx;
    board.userIdx = userIdx;
    board.title = title;
    board.category = category;
    board.description = description;
    return board;
  }
  updateFromDto(dto: UpdateBoardDto) {
    this.title = dto.title;
    this.description = dto.description;
  }
}
