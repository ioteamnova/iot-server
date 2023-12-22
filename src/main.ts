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

  await app.listen(3000);

  // 어플리케이션이 클라이언트의 요청처리가 가능한 상태가 되었을때 pm2에 ready신호를 보내기 (process.send 함수는 pm2로 실행되었을 경우에만 존재하여 분기처리를 했다)
  if(process.send){
    process.send("ready");
    console.log(`pm2로 실행되었습니다.`);
  }
}

bootstrap();
