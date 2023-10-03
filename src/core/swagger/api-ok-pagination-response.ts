import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageResponseDto } from './page-response.dto';
import { ResponseDto } from './response-dto';

// 200 Ok response 템플릿
export const ApiOkPaginationResponseTemplate = <
  DtoClass extends Type<unknown>,
>(params: {
  description?: string;
  type: DtoClass;
}) => {
  return applyDecorators(
    ApiExtraModels(ResponseDto, PageResponseDto, params.type),
    ApiOkResponse({
      description: params.description,
      schema: {
        allOf: [
          // ResponseDto 의 프로퍼티를 가져옴
          { $ref: getSchemaPath(PageResponseDto) },
          // array items 프로퍼티 세팅
          {
            properties: {
              result: {
                properties: {
                  pageSize: {
                    type: 'number',
                    default: 20,
                    description: '페이지 크기',
                  },
                  totalCount: {
                    type: 'number',
                    default: 1,
                    description: '아이템 총 개수',
                  },
                  totalPage: {
                    type: 'number',
                    default: 1,
                    description: '총 페이지 수',
                  },
                  existsNextPage: {
                    type: 'boolean',
                    default: false,
                    description: '다음 페이지 여부',
                  },
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(params.type) },
                    description: '조회된 아이템 목록',
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
