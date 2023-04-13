import { UserService } from './../user/user.service';
import { validatePassword } from './../../utils/password.utils';
import { HttpErrorConstants } from './../../core/http/http-error-objects';
import { UserRepository } from './../user/repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { SocialLoginUserDto } from './dtos/social-login-user.dto';
import { SocialMethodType } from './helpers/constants';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly userService: UserService,
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

    const payload = { userIdx: user.idx };
    const accessToken = this.jwtService.sign(payload);
    return {
      idx: user.idx,
      accessToken: accessToken,
    };
  }

  /**
   * 소셜 로그인
   * @param socialLoginUserDto
   * @returns JwtToken
   */
  async socialLogin(dto: SocialLoginUserDto) {
    let user;
    switch (dto.socialType) {
      case SocialMethodType.KAKAO: {
        user = await this.getUserByKakaoAccessToken(dto.accessToken);
        break;
      }
      default: {
        throw new Error('default 에러'); //소셜로그인 선택 실패 예외처리
      }
    }
    const accessToken = await this.generateAccessToken(user.idx);

    return {
      // idx: user.idx,
      accessToken: accessToken,
    };
  }

  async getUserByKakaoAccessToken(accessToken: string): Promise<User> {
    // KAKAO LOGIN 회원조회 REST-API
    const userInfoFromKakao = await axios.get(
      'https://kapi.kakao.com/v2/user/me',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    if (!userInfoFromKakao) throw new Error('kakao 아이디가 없는 유저임.'); //카카오 로그인 실패 예외처리
    const user = await this.userRepository.findOne({
      where: userInfoFromKakao.data.kakao_account.email,
    });
    // 회원 이메일이 없으면 회원가입 후 아이디 반환
    if (!user) {
      console.log('회원가입해야하는유저임');
      const nickname = userInfoFromKakao.data.properties.nickname;
      console.log('kakaoNickname::', nickname);
      const email = userInfoFromKakao.data.kakao_account.email;
      console.log('kakaoEmail::', email);
      await this.userService.createSocialUser(nickname, email);
      return user;
    }

    return user;
  }

  async generateAccessToken(email: string): Promise<string> {
    const payload = { socialEmail: email };
    return this.jwtService.sign(payload);
  }
}
