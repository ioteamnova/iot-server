import { UserService } from './../user/user.service';
import { validatePassword } from './../../utils/password.utils';
import { HttpErrorConstants } from './../../core/http/http-error-objects';
import { UserRepository } from './../user/repositories/user.repository';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { SocialLoginUserDto } from './dtos/social-login-user.dto';
import { SocialMethodType } from './helpers/constants';
import { User } from '../user/entities/user.entity';
import { LoginResponseDto } from './dtos/login-response.dto';
import { detectPlatform } from './../../utils/client.utils';
import { RefTokenRepository } from './repositories/ref-token.repository';
import { FbTokenRepository } from './repositories/fb-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refTokenRepository: RefTokenRepository,
    private readonly fbTokenRepository: FbTokenRepository,
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  private logger = new Logger('Auth');

  /**
   * 로그인
   * @param loginUserDto
   * @returns JwtToken
   */
  async login(userAgent: string, dto: LoginUserDto): Promise<LoginResponseDto> {
    // 클라이언트의 플랫폼 확인
    const platform = detectPlatform(userAgent);
    this.logger.log(`login platform: ${platform}`);

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

    // 인자에 해당하는 FbToken을 가지고 있는 행이 있다면 삭제한다
    await this.fbTokenRepository.removeFbTokenIfExists(firebaseToken);

    await this.fbTokenRepository.createOrUpdateFbToken(
      user.idx,
      platform,
      firebaseToken,
    );

    const accessToken = await this.generateAccessToken(user.idx, platform);
    const refreshToken = await this.generateRefreshToken(user.idx, platform);

    await this.refTokenRepository.createOrUpdateRefToken(
      user.idx,
      platform,
      refreshToken,
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      idx: user.idx,
      profilePath: user.profilePath,
      nickname: user.nickname,
    };
  }

  /**
   * 소셜 로그인
   * @param socialLoginUserDto
   * @returns JwtToken
   */
  async socialLogin(
    userAgent: string,
    dto: SocialLoginUserDto,
  ): Promise<LoginResponseDto> {
    // 클라이언트의 플랫폼 확인
    const platform = detectPlatform(userAgent);
    this.logger.log(`socialLogin platform: ${platform}`);

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
    await this.fbTokenRepository.createOrUpdateFbToken(
      user.idx,
      platform,
      firebaseToken,
    );

    const accessToken = await this.generateAccessToken(user.idx, platform);
    const refreshToken = await this.generateRefreshToken(user.idx, platform);

    await this.refTokenRepository.createOrUpdateRefToken(
      user.idx,
      platform,
      refreshToken,
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      idx: user.idx,
      profilePath: user.profilePath,
      nickname: user.nickname,
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

  async generateAccessToken(
    userIdx: number,
    platform: string,
  ): Promise<string> {
    const payload = { userIdx: userIdx, OS: platform };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '2h',
    });
  }

  async generateRefreshToken(
    userIdx: number,
    platform: string,
  ): Promise<string> {
    const payload = { userIdx: userIdx, OS: platform };
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
  async getNewAccessToken(userAgent: string, refToken: string) {
    // 클라이언트의 플랫폼 확인
    const platform = detectPlatform(userAgent);
    this.logger.log(`getNewAccessToken platform: ${platform}`);

    // 1. 요청으로 받은 리프레시 토큰이 DB에 존재하는지 확인
    const refTokenEntity = await this.refTokenRepository.findOne({
      where: {
        refToken,
      },
    });
    if (!refTokenEntity) {
      throw new UnauthorizedException(HttpErrorConstants.INVALID_TOKEN);
    }

    // 2. 리프레시 토큰 만료기간 검증
    const refreshTokenMatches = await this.jwtService.verify(refToken);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException(HttpErrorConstants.EXPIRED_REFRESH_TOKEN);
    }

    // 3. 액세스토큰 재생성
    const accessToken = await this.generateAccessToken(
      refTokenEntity.userIdx,
      platform,
    );

    return {
      accessToken,
    };
  }

  // 로그아웃시 userIdx와 플랫폼에 해당하는 refToken과 fbtoken 값을 각각의 테이블에서 null로 업데이트
  async logout(userAgent: string, userIdx: number) {
    // 클라이언트의 플랫폼 확인
    const platform = detectPlatform(userAgent);
    this.logger.log(`logout platform: ${platform}`);

    await this.refTokenRepository.update(
      { userIdx, platform },
      { refToken: null },
    );
    await this.fbTokenRepository.update(
      { userIdx, platform },
      { fbToken: null },
    );
  }
}
