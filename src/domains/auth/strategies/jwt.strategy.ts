import { UserRepository } from '../../user/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { jwtConstants } from '../auth-guards/jwt.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더로부터 토큰 추출하는 함수. Bearer 타입 사용
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret, //todo: env로 빼기
      jsonWebTokenOptions: {
        subject: 'userInfo',
        issuer: 'reptimate.store',
      },
    });
  }

  async validate(payload: any) {
    console.log('payload::', payload);
    return { userIdx: payload.idx };
  }

  // private printRequestLogs(userIdx: number, req: Request, user: User) {
  //   let logMessageContent: any = {
  //     userInfo: user,
  //     userToken: req.headers['authorization'],
  //   };

  //   if (Object.keys(req.query).length) {
  //     logMessageContent = {
  //       ...logMessageContent,
  //       type: 'requestQuery',
  //       query: JSON.stringify(req.query),
  //     };
  //   }

  //   if (Object.keys(req.body).length) {
  //     logMessageContent = {
  //       ...logMessageContent,
  //       type: 'requestBody',
  //       body: JSON.stringify(req.body),
  //     };
  //   }
  //   httpContext.set('userIdx', user.idx);

  //   logger.info(logMessageContent);
  // }
}
