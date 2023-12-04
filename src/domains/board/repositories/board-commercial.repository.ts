import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { BoardCommercial } from '../entities/board-commercial.entity';
import { BoardListDto } from '../dtos/board-list.dto';

@CustomRepository(BoardCommercial)
export class BoardCommercialRepository extends Repository<BoardCommercial> {
  async findRecommendItem(morph: string, sequence: number) {
    const boards = await this.createQueryBuilder('boardCommercial')
      .leftJoinAndSelect('boardCommercial.board', 'board')
      .leftJoinAndSelect('board.user', 'user')
      .where('boardCommercial.pattern = :pattern', { pattern: morph })
      .andWhere('board.category = :category', { category: 'adoption' })
      .andWhere('boardCommercial.state = :state', { state: 'selling' })
      .orderBy('board.view', 'DESC') // 'view' 컬럼을 기준으로 내림차순 정렬
      .take(sequence)
      .getMany(); // sequence 수 만큼 결과를 가져오도록 수정
    const processedBoards = boards.map((boardCommercial) => {
      const { idx, nickname } = boardCommercial.board.user;
      const { user, ...restBoard } = boardCommercial.board;
      const processedBoardCommercial = {
        ...boardCommercial,
        user: {
          idx,
          nickname,
        },
        board: restBoard,
      };
      return processedBoardCommercial;
    });

    return processedBoards;
  }
  async findExtraItems(sequence: number) {
    const boards = await this.createQueryBuilder('boardCommercial')
      .leftJoinAndSelect('boardCommercial.board', 'board')
      .leftJoinAndSelect('board.user', 'user')
      .where('boardCommercial.state = :state', { state: 'selling' })
      .orderBy('board.view', 'DESC') // 'view' 컬럼을 기준으로 내림차순 정렬
      .take(sequence)
      .getMany(); // sequence 수 만큼 결과를 가져오도록 수정

    const processedBoards = boards.map((boardCommercial) => {
      const { idx, nickname } = boardCommercial.board.user;
      const { user, ...restBoard } = boardCommercial.board;
      const processedBoardCommercial = {
        ...boardCommercial,
        user: {
          idx,
          nickname,
        },
        board: restBoard,
      };
      return processedBoardCommercial;
    });
    return processedBoards;
  }
}
