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
    defaultModelsExpandDepth: 1, // -1 이면 페이지 하단에 dtos 목록 표시 안함 (기본값도 표시 X)
    docExpansion: 'none', // 페이지 접속시 자동 상세보기 off
    persistAuthorization: true, // 페이지 새로고침해도 토큰유지
    tagsSorter: 'alpha', // 태그 정렬
    operationsSorter: 'alpha', // 태그 내 함수 순서. 'alpha':abc순, 'method': HTTP method별 분류
    displayRequestDuration: true, // http request 시간 표시
    showCommonExtensions: true,
    showExtensions: true,
  },
};
