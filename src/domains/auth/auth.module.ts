import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { UserRepository } from '../user/repositories/user.repository';
import { UserModule } from './../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwt/refresh-token.strategy';
import { FbTokenRepository } from './repositories/fb-token.repository';
import { RefTokenRepository } from './repositories/ref-token.repository';

@Module({
  imports: [    
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? 'env.dev' : 'env.prod',
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '2h',
        },
      }),
    }),
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      RefTokenRepository,
      FbTokenRepository
    ]),
    PassportModule,
    forwardRef(() => UserModule),
    // RedisModule.forRoot({
    //   readyLog: true,
    //   config: {
    //     host: process.env.REDIS_HOST,
    //     // host : 'www.reptimate.store',
    //     port: 6379,
    //     // password: 'foobared'
    //   },
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy],
  exports: [AuthService, JwtStrategy, PassportModule, JwtRefreshTokenStrategy], // ?: JwtStrategy, PassportModule, JwtRefreshTokenStrategy은 왜 export를 하는건지
})
export class AuthModule {}
