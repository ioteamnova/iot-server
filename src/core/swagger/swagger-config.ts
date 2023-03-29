import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

/**
 * 스웨거 설정 파일
 */

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Reptimate Rest API')
  .setDescription('Swagger API description') //todo: api-readme 작성하기
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      name: 'JWT',
      in: 'header',
    },
    'accessToken',
  )
  .build();

export const initSwagger = async (app: INestApplication) => {
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDocument, swaggerOptions);
};

// swagger 옵션 설정
export const swaggerOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    //defaultModelsExpandDepth: -1, // 페이지 하단에 dtos 목록 표시 안함
    docExpansion: 'none',
    persistAuthorization: true, // 페이지 새로고침 토큰 큐지
    apisSorter: 'alpha', // 태그 순서. can also be a function
    operationsSorter: 'function', // 태그 내 함수 순서. 'alpha':abc순, 'method': HTTP method별로 분류
  },
};
