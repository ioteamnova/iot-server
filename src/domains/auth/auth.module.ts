import { UserModule } from './../user/user.module';
import { AuthService } from './auth.service';
import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserRepository } from '../user/repositories/user.repository';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwt/refresh-token.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '2h',
        },
      }),
    }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    PassportModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy],
  exports: [AuthService, JwtStrategy, PassportModule, JwtRefreshTokenStrategy],
})
export class AuthModule {}
