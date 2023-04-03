import { UserRepository } from './../../user/repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/domains/user/entities/user.entity';
import { ExtractJwt } from 'passport-jwt';
import { jwtConstants } from '../auth-guards/jwt.constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더로부터 토큰 추출하는 함수. Bearer 타입 사용
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload): Promise<any> {
    const { email } = payload;
    const user: User = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('jwt-strategy-validate error::');
    }

    return user;
  }
}
