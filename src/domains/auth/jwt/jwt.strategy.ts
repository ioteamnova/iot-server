import { UserRepository } from '../../user/repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

import { HttpErrorConstants } from 'src/core/http/http-error-objects';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더로부터 토큰 추출하는 함수. Bearer 타입 사용
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: {
        idx: payload.userIdx,
      },
    });
    if (!user) {
      throw new UnauthorizedException(HttpErrorConstants.EXPIRED_ACCESS_TOKEN); //액세스 토큰 만료. 재발급 필요
    }

    return user;
  }
}
