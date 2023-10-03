import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/domains/user/repositories/user.repository';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private userRepository: UserRepository,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(req: Request, payload: any) {
    const redis = this.redisService.getClient();
    const userInfo = await redis.get(`userInfo${payload.userIdx}`);
    let user;
    if (!userInfo) {
      user = await this.userRepository.findOne({
        where: {
          idx: payload.userIdx,
        },
      });
      const userString = JSON.stringify(user); // 주어진 자료구조를 문자열로 변환
      await redis.set(`userInfo${payload.userIdx}`, userString); // 문자열로 변환된 자료구조를 Redis에 저장
    } else {
      user = JSON.parse(userInfo); // Redis에서 가져온 문자열을 자료구조로 변환
    }
    if (!user) {
      throw new UnauthorizedException(HttpErrorConstants.EXPIRED_ACCESS_TOKEN); // 액세스 토큰 만료. 재발급 필요
    }
    return user;
  }
}
