import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { StatusCodes } from 'http-status-codes';
import { HttpErrorConstants } from '../http/http-error-objects';

// 로그인 필요시 반환하는 에러 리스폰스
export const ApiUnauthorizedErrorResponse = () => {
  return applyDecorators(
    ApiResponse({
      status: StatusCodes.UNAUTHORIZED,
      description: `로그인 필요, 엑세스토큰의 만료, 유효하지 않은 로그인 정보`,
      content: {
        'application/json': {
          example: {
            status: StatusCodes.UNAUTHORIZED,
            message: HttpErrorConstants.UNAUTHORIZED.message,
          },
        },
      },
    }),
  );
};
