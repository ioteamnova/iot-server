import { ConfigService } from '@nestjs/config';
import { UserService } from './../user/user.service';
import { validatePassword } from './../../utils/password.utils';
import { HttpErrorConstants } from './../../core/http/http-error-objects';
import { UserRepository } from './../user/repositories/user.repository';
import {
  ForbiddenException,
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
    private configService: ConfigService,
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

  // 로그아웃시 리프레시 토큰 삭제
  async removeRefreshToken(userIdx: number) {
    return this.userRepository.update(userIdx, { refreshToken: null });
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
        user = await this.getUserByKakaoAccessToken(
          dto.accessToken,
          dto.socialType,
        );
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
     1. 이메일로 조회
     2. 없으면 회원가입 처리
     3. 유저 생성 후 리턴
     */
  async getUserByKakaoAccessToken(
    accessToken: string,
    socialType: SocialMethodType.KAKAO,
  ): Promise<User> {
    const userInfoFromKakao = await axios.get(
      'https://kapi.kakao.com/v2/user/me',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    if (!userInfoFromKakao) {
      throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
    }

    const user = await this.userRepository.findByEmail(
      userInfoFromKakao.data.kakao_account.email,
    );
    if (user) {
      return user;
    }

    const nickname = userInfoFromKakao.data.properties.nickname;
    const email = userInfoFromKakao.data.kakao_account.email;
    const kakaoUser = await this.userService.createSocialUser(
      email,
      nickname,
      socialType,
    );

    return kakaoUser;
  }

  /** 이메일, 닉네임, 소셜 타입을 받아서 구글/애플 로그인 처리
     1. 이메일로 조회
     2. 없으면 회원가입 처리
     3. 유저 생성 후 리턴
     */
  async getSocialLoginUser(dto: SocialLoginUserDto): Promise<User> {
    const user = await this.userRepository.findByEmail(dto.email);
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
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(userIdx: number): Promise<string> {
    const payload = { userIdx: userIdx };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '14 days',
    });
  }

  async getNewAccessToken(userIdx: number, oldRefreshToken: string) {
    // 1. 유저 확인
    const user = await this.userRepository.findByUserIdx(userIdx);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }
    console.log('user::', user);

    // 2. 리프레시 토큰 DB와 일치 여부 확인
    const savedRefreshToken = await this.userRepository.findOne({
      where: {
        refreshToken: oldRefreshToken,
      },
    });
    if (!savedRefreshToken) {
      throw new UnauthorizedException(HttpErrorConstants.CANNOT_FIND_TOKEN);
    }
    console.log('savedRefreshToken::', savedRefreshToken);

    // 3. 리프레시 토큰 만료기간 검증
    const refreshTokenMatches = await this.jwtService.verify(oldRefreshToken, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    if (!refreshTokenMatches) {
      throw new UnauthorizedException(
        HttpErrorConstants.ALLREADY_EXPIRED_TOKEN,
      );
    }

    // 4. 액세스토큰 재생성
    const accessToken = await this.generateAccessToken(user.idx);

    return {
      accessToken,
    };
  }
}
