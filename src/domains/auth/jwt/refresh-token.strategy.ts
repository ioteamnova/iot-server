import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/domains/user/repositories/user.repository';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(req: Request, payload: any) {
    const user = await this.userRepository.findOne({
      where: {
        idx: payload.userIdx,
      },
    });
    if (!user) {
      throw new UnauthorizedException(HttpErrorConstants.EXPIRED_REFRESH_TOKEN); //리프레시 토큰 만료. 재로그인 필요
    }
    return user;
  }
}
