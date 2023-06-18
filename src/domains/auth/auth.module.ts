import { UserModule } from './../user/user.module';
import { AuthService } from './auth.service';
import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserRepository } from '../user/repositories/user.repository';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { ConfigService } from '@nestjs/config';
// import { RefreshTokenStrategy } from './jwt/refresh-token.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '600', //테스트용 60초 AccessToken
          issuer: 'reptimate.store',
          subject: 'userInfo',
        },
      }),
    }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    PassportModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
