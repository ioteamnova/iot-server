import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { setNestApp } from './core/http/interceptors';
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

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // cors 설정
  app.enableCors();

  // setNestApp(app);

  // pm2로 실행했는지에 따른 분기처리
  if(process.send){
    app.listen(3000, () => {
      process.send("ready");
      console.log(`pm2로 실행: O`);
    });
  } else{
    await app.listen(3000);
    console.log(`pm2로 실행: X`);
  }
}

bootstrap();
