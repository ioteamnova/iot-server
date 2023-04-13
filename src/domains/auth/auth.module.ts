import { UserModule } from './../user/user.module';
import { AuthService } from './auth.service';
import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserRepository } from '../user/repositories/user.repository';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './jwt/jwt.constants';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserService } from '../user/user.service';
import { GoogleStrategy } from './jwt/jwt.google-strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '365 days',
        issuer: 'reptimate.store',
        subject: 'userInfo',
      },
    }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
    PassportModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
