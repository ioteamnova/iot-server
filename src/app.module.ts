import { AuthModule } from './domains/auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './domains/user/entities/user.entity';
import { UserModule } from './domains/user/user.module';
import { LoggerMiddleware } from './core/middlewares/logger.middleware';
import { DiaryModule } from './domains/diary/diary.module';
import { IotPersonalModule } from './domains/iot_personal/iot_personal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
      // todo: 환경 변수 유효성 검사 joi
    }),
    //todo: 설정파일 분리
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: true,
      timezone: 'Asia/Seoul',
      namingStrategy: new SnakeNamingStrategy(),
    }),
    UserModule,
    AuthModule,
    DiaryModule,
    IotPersonalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
