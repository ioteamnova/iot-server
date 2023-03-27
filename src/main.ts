import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './utils/logger';

async function bootstrap() {
  logger.info(
    `====================== API Start - ${process.env.NODE_ENV} !!======================`,
  );
  logger.info(
    `====================== MYSQL_HOST Start - ${process.env.MYSQL_HOST} !!======================`,
  );

  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors();

  await app.listen(3000);
}
bootstrap();
