import { UserService } from './../user/user.service';
import { validatePassword } from './../../utils/password.utils';
import { HttpErrorConstants } from './../../core/http/http-error-objects';
import { UserRepository } from './../user/repositories/user.repository';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { SocialLoginUserDto } from './dtos/social-login-user.dto';
import { SocialMethodType } from './helpers/constants';
import { User } from '../user/entities/user.entity';
import { LoginResponseDto } from './dtos/login-response.dto';

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
  async login(dto: LoginUserDto): Promise<LoginResponseDto> {
    const { email, password } = dto;
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      // 유저가 존재하지 않는 경우에는 NotFoundException 던져주는 것이 일반적이나, 로그인에서만 예외적으로 이메일, 비밀번호 중 어떤 정보가 잘못 됐는지 확인하지 못하게 하기 위하여 UnauthorizedException로 통일함.
      throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
    }

    await validatePassword(password, user.password);

    const firebaseToken = dto.fbToken;
    await this.userRepository.updateFirebaseTokenByUserIdx(
      user.idx,
      firebaseToken,
    );

    const accessToken = await this.generateAccessToken(user.idx);
    const refreshToken = await this.generateRefreshToken(user.idx);

    // todo: 암호화해서 리프레시 토큰 저장
    await this.userRepository.update(user.idx, { refreshToken: refreshToken });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      idx: user.idx,
    };
  }

  /**
   * 소셜 로그인
   * @param socialLoginUserDto
   * @returns JwtToken
   */
  async socialLogin(dto: SocialLoginUserDto): Promise<LoginResponseDto> {
    let user;
    switch (dto.socialType) {
      case SocialMethodType.KAKAO: {
        user = await this.getUserByKakaoAccessToken(dto);
        break;
      }
      case SocialMethodType.GOOGLE: {
        user = await this.getSocialLoginUser(dto);
        break;
      }
      case SocialMethodType.APPLE: {
        user = await this.getSocialLoginUser(dto);
        break;
      }
      default: {
        throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH); //소셜로그인 선택 실패 예외처리
      }
    }

    const firebaseToken = dto.fbToken;
    await this.userRepository.updateFirebaseTokenByUserIdx(
      user.idx,
      firebaseToken,
    );

    const accessToken = await this.generateAccessToken(user.idx);
    const refreshToken = await this.generateRefreshToken(user.idx);
    // todo: 암호화해서 리프레시 토큰 저장
    await this.userRepository.update(user.idx, { refreshToken: refreshToken });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      idx: user.idx,
    };
  }

  /** 액세스토큰, 소셜 타입을 받아서 카카오 로그인 처리
     1. 이메일과 로그인 메서드로 기존 소셜로그인 유저인지 확인
     2. 없으면 회원가입 처리
     3. 유저 생성 후 리턴
     */
  async getUserByKakaoAccessToken(dto: SocialLoginUserDto): Promise<User> {
    const userInfoFromKakao = await axios.get(
      'https://kapi.kakao.com/v2/user/me',
      {
        headers: { Authorization: `Bearer ${dto.accessToken}` },
      },
    );
    if (!userInfoFromKakao) {
      throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
    }
    const user = await this.userRepository.findOne({
      where: {
        email: userInfoFromKakao.data.kakao_account.email,
        loginMethod: dto.socialType,
      },
    });
    if (user) {
      return user;
    }

    const nickname = userInfoFromKakao.data.properties.nickname;
    const email = userInfoFromKakao.data.kakao_account.email;
    const kakaoUser = await this.userService.createSocialUser(
      email,
      nickname,
      dto.socialType,
    );

    return kakaoUser;
  }

  /** 이메일, 닉네임, 소셜 타입을 받아서 구글/애플 로그인 처리
     1. 이메일과 로그인 메서드로 기존 소셜로그인 유저인지 확인
     2. 없으면 회원가입 처리
     3. 유저 생성 후 리턴
     */
  async getSocialLoginUser(dto: SocialLoginUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
        loginMethod: dto.socialType,
      },
    });
    if (user) {
      return user;
    }

    const socialUser = await this.userService.createSocialUser(
      dto.email,
      dto.nickname,
      dto.socialType,
    );

    return socialUser;
  }

  async generateAccessToken(userIdx: number): Promise<string> {
    const payload = { userIdx: userIdx };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '2h',
    });
  }

  async generateRefreshToken(userIdx: number): Promise<string> {
    const payload = { userIdx: userIdx };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '14 days',
    });
  }

  /**
   * 리프레시 토큰으로 액세스 토큰 재생성
   * @param refreshToken 리프레시토큰
   * @returns 새로운 액세스 토큰
   */
  async getNewAccessToken(refreshToken: string) {
    // 1. DB의 리프레시 토큰과 일치 여부 확인
    const user = await this.userRepository.findOne({
      where: {
        refreshToken: refreshToken,
      },
    });
    if (!user) {
      throw new UnauthorizedException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    // 2. 리프레시 토큰 만료기간 검증
    const refreshTokenMatches = await this.jwtService.verify(refreshToken);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException(HttpErrorConstants.EXPIRED_REFRESH_TOKEN);
    }

    // 3. 액세스토큰 재생성
    const accessToken = await this.generateAccessToken(user.idx);

    return {
      accessToken,
    };
  }

  // 로그아웃시 파이어베이스 토큰, 리프레시 토큰 삭제
  async logout(userIdx: number) {
    await this.userRepository.update(userIdx, { fbToken: null });
    await this.userRepository.update(userIdx, { refreshToken: null });
  }
}
