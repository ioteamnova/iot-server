import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initSwagger } from './core/swagger/swagger-config';
import { logger } from './utils/logger';

async function bootstrap() {
  logger.info(
    `====================== API Start - ${process.env.NODE_ENV} !!======================`,
  );
  logger.info(
    `====================== MYSQL_HOST Start - ${process.env.MYSQL_HOST} !!======================`,
  );

  const app = await NestFactory.create(AppModule);

  // 스웨거 시작
  initSwagger(app);

  // api 버전 추가
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // cors 설정
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
