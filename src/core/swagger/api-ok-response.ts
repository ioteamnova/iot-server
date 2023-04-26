import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseDto } from './response-dto';

// 200 Ok response 템플릿
export const ApiOkResponseTemplate = <DtoClass extends Type<unknown>>(params?: {
  description?: string;
  type?: DtoClass;
  isArray?: boolean;
}) => {
  if (params?.type) {
    const schema = {
      description: params.description,
      schema: {
        allOf: [
          // ResponseDto 의 프로퍼티를 가져옴
          { $ref: getSchemaPath(ResponseDto) },

          {
            properties: {
              result: params.isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(params.type) },
                    // eslint-disable-next-line no-mixed-spaces-and-tabs
                  }
                : {
                    $ref: getSchemaPath(params.type),
                    // eslint-disable-next-line no-mixed-spaces-and-tabs
                  },
            },
          },
        ],
      },
    };
    return applyDecorators(
      ApiExtraModels(ResponseDto, params?.type),
      ApiOkResponse(schema),
    );
  } else {
    const schema = {
      description: params?.description,
      schema: {
        allOf: [
          // ResponseDto 의 프로퍼티를 가져옴
          { $ref: getSchemaPath(ResponseDto) },
        ],
      },
    };
    return applyDecorators(ApiExtraModels(ResponseDto), ApiOkResponse(schema));
  }
};
