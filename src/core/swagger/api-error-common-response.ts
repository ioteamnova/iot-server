import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';

// 공용으로 사용되는 에러 리스폰스
export const ApiCommonErrorResponseTemplate = () => {
  return applyDecorators(
    ApiResponse({
      status: StatusCodes.UNPROCESSABLE_ENTITY,
      description:
        '필수 파라미터가 오지 않았을 경우, 혹은 파라미터 형식이 맞지 않을 경우',
      content: {
        'application/json': {
          example: {
            status: StatusCodes.UNPROCESSABLE_ENTITY,
            errorCode: 'UNPROCESSABLE_ENTITY',
            message: 'xxx should not be empty / xxx should be array 등',
          },
        },
      },
    }),

    ApiResponse({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      description:
        '서버에서 예외처리하지 않은 에러 발생시 ( 500에러 발생시 제보 부탁드립니다. )',
      content: {
        'application/json': {
          example: {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
          },
        },
      },
    }),
  );
};
