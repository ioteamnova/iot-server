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

  // // pm2로 실행했는지에 따른 분기처리
  // if(process.send){
  await app.listen(3000);

  process.send("ready");
  console.log(`pm2로 실행: O`);

  // app.listen(3000, () => {
  //   process.send("ready");
  //   console.log(`pm2로 실행: O`);
  // });


  //   // SIGINT 시그널이 전달되면 app.close명령어로 프로세스가 새로운 요청을 받는 것을 거절하고 기존 연결은 유지하게 처리
  //   process.on('SIGINT', async () => {
  //   try {
  //     console.log('Closing server...');
  //     await app.close();
  //     console.log('Server closed');
  //     process.exit(0);
  //   } catch (e) {
  //     console.error('Error closing server:', e);
  //     process.exit(1);
  //   }
  // });
    
  // } else{
    // await app.listen(3000);
    // console.log(`pm2로 실행: X`);
  // }
}

bootstrap();
