import { UserRepository } from '../../user/repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더로부터 토큰 추출하는 함수. Bearer 타입 사용
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      jsonWebTokenOptions: {
        subject: 'userInfo',
        issuer: 'reptimate.store',
      },
    });
  }

  async validate(payload: any) {
    console.log('JWT strategy!!');
    const user = await this.userRepository.findOne({
      where: {
        idx: payload.userIdx,
      },
    });
    return user;
  }
}
