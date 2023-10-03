import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import { HttpErrorFormat } from '../http/http-error-objects';
import { applyDecorators } from '@nestjs/common';

// 스웨거 에러리스폰스 설정용 템플릿
export const ApiErrorResponseTemplate = (
  paramsList: {
    status?: number;
    errorFormat?: HttpErrorFormat;
    errorFormatList?: HttpErrorFormat[];
  }[],
) => {
  const decorators: Array<ClassDecorator> = paramsList.map((params) => {
    const { status, errorFormat, errorFormatList } = params;

    if (errorFormatList) {
      const errorParams: ApiResponseOptions = {
        status: status,
        description: errorFormatList.reduce((prev, current, idx) => {
          prev =
            prev +
            `- ${current.errorCode}: ${
              current.description || current.message
            }      \n`;
          return prev;
        }, ``),
        content: {
          'application/json': {
            examples: errorFormatList.reduce((prev, current, idx) => {
              prev[current.errorCode] = {
                value: {
                  status,
                  message: current.message,
                  errorCode: current.errorCode,
                },
              };
              return prev;
            }, {}),
          },
        },
      };

      return ApiResponse(errorParams);
    }

    const errorParams = {
      status: status,
      description: `- ${errorFormat?.errorCode}:${errorFormat?.message} `,
      content: {
        'application/json': {
          example: {
            status: status,
            ...errorFormat,
          },
        },
      },
    };
    return ApiResponse(errorParams);
  });

  return applyDecorators(...decorators);
};
