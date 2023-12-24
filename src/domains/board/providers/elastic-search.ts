import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Injectable } from '@nestjs/common';
import { Board } from '../entities/board.entity';
import { BoardCommercial } from '../entities/board-commercial.entity';
import { BoardAuction } from '../entities/board-auction.entity';
import { BoardCategoryPageRequest } from '../dtos/board-category-page';

@Injectable()
export class BoardElasticSearch {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async insertBoard(
    board: Board,
    boardCommercial?: BoardCommercial,
    boardAuction?: BoardAuction,
  ) {
    const keywords = {
      title: board.title,
      description: board.description,
    };
    if (boardCommercial !== undefined && boardCommercial !== null) {
      board.boardCommercial = boardCommercial;
      keywords['pettern'] = boardCommercial.pattern;
      keywords['size'] = boardCommercial.size;
      keywords['variety'] = boardCommercial.variety;
      keywords['gender'] = boardCommercial.gender;
    }
    if (boardAuction !== undefined && boardAuction !== null) {
      board.boardAuction = boardAuction;
      keywords['pettern'] = boardAuction.pattern;
      keywords['size'] = boardAuction.size;
      keywords['variety'] = boardAuction.variety;
      keywords['gender'] = boardAuction.gender;
    }
    board.keywords = JSON.stringify(keywords);
    await this.elasticsearchService.index({
      index: 'nori_board',
      id: board.idx.toString(),
      body: board,
    });
  }
  async boardSearch(boardIdx: number) {
    try {
      const response = await this.elasticsearchService.get({
        index: 'nori_board',
        id: boardIdx.toString(),
      });
      console.log('response: ', response);
      return response;
    } catch (error) {
      // 문서가 존재하지 않을 경우 예외 처리
      if (error.statusCode === 404) {
        return null;
      }

      throw error;
    }
  }
  // 통합 검색 -> 'adoption', 'auction', 'market', 'ask', 'free'에 대한 게시물이 최대 5개씩 조회합니다.
  async searchTotal(keyword: string): Promise<any> {
    const categories = ['adoption', 'auction', 'market', 'ask', 'free'];
    const results = {};
    for (const category of categories) {
      const result = await this.elasticsearchService.search({
        index: 'nori_board', // 'board'에서 'nori_board'로 변경
        body: {
          query: {
            bool: {
              must: [
                {
                  match: {
                    keywords: keyword,
                  },
                },
                {
                  match: {
                    category: category,
                  },
                },
              ],
            },
          },
          size: 5,
          sort: [
            {
              _score: {
                order: 'desc',
              },
            },
          ],
        },
      });
      results[category] = result.hits.hits;
    }
    return results;
  }
  // 키워드 검색한 내용 카테고리로 모아서 보기 -> 20개씩 페이징 합니다.
  async searchCategory(
    keyword: string,
    pageRequest: BoardCategoryPageRequest,
  ): Promise<any> {
    console.log(keyword);
    const result = await this.elasticsearchService.search({
      index: 'nori_board',
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  keywords: keyword,
                },
              },
              {
                match: {
                  category: pageRequest.category,
                },
              },
            ],
          },
        },
        size: pageRequest.limit,
        from: pageRequest.offset,
        sort: [
          {
            _score: {
              order: 'desc',
            },
          },
        ],
      },
    });
    return result.hits.hits;
  }
  async deleteBoard(boardIdx: number): Promise<any> {
    try {
      const response = await this.elasticsearchService.delete({
        index: 'nori_board',
        id: boardIdx.toString(),
      });

      // response에는 삭제에 대한 정보가 담겨있을 것입니다.
      return response;
    } catch (error) {
      console.error('Error deleting documents:', error);
      throw error;
    }
  }

  async updateBoard(
    boardIdx: number,
    board: Board,
    boardCommercial?: BoardCommercial,
    boardAuction?: BoardAuction,
  ) {
    await this.deleteBoard(boardIdx);
    await this.insertBoard(board, boardCommercial, boardAuction);
  }
}
