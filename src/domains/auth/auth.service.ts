import { validatePassword } from './../../utils/password.utils';
import { HttpErrorConstants } from './../../core/http/http-error-objects';
import { UserRepository } from './../user/repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * 로그인
   * @param loginUserDto
   * @returns JwtToken
   */
  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ idx: number; accessToken: string }> {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      // 유저가 존재하지 않는 경우에는 NotFoundException 던져주는 것이 일반적이나, 로그인에서만 예외적으로 이메일, 비밀번호 중 어떤 정보가 잘못 됐는지 확인하지 못하게 하기 위하여 UnauthorizedException로 통일함.
      throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
    }
    await validatePassword(password, user.password);

    // const isPasswordValidated: boolean = await comparePassword(
    //   password,
    //   user.password,
    // );

    // if (!isPasswordValidated) {
    //   throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
    // }

    const payload = { userIdx: user.idx };
    const accessToken = this.jwtService.sign(payload);
    return {
      idx: user.idx,
      accessToken: accessToken,
    };
  }

  // async verify(jwtString: string) {
  //   try {
  //     const payload = jwt.verify(jwtString, this.config.jwtSecret) as (
  //       | jwt.JwtPayload
  //       | string
  //     ) &
  //       User;

  //     const { id, email } = payload;

  //     return {
  //       userId: id,
  //       email,
  //     };
  //   } catch (e) {
  //     throw new UnauthorizedException();
  //   }
  // }
}
