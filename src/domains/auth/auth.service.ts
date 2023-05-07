import { UserService } from './../user/user.service';
import { validatePassword } from './../../utils/password.utils';
import { HttpErrorConstants } from './../../core/http/http-error-objects';
import { UserRepository } from './../user/repositories/user.repository';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { SocialLoginUserDto } from './dtos/social-login-user.dto';
import { SocialMethodType } from './helpers/constants';
import { User } from '../user/entities/user.entity';
import { google, Auth } from 'googleapis';
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
  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
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
      accessToken: accessToken,
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
        user = await this.getUserByKakaoAccessToken(
          dto.accessToken,
          dto.socialType,
        );
        break;
      }
      case SocialMethodType.GOOGLE: {
        user = await this.getUserByGoogleAccessToken(dto);
        break;
      }
      case SocialMethodType.APPLE: {
        user = await this.getUserByAppleAccessToken(
          dto.accessToken,
          dto.socialType,
        );
        break;
      }
      default: {
        throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH); //소셜로그인 선택 실패 예외처리
      }
    }
    const accessToken = await this.generateAccessToken(user.idx);
    return {
      accessToken: accessToken,
      idx: user.idx,
    };
  }

  async getUserByKakaoAccessToken(
    accessToken: string,
    socialType: SocialMethodType.KAKAO,
  ): Promise<User> {
    /** 액세스토큰, 소셜 타입을 받아서 카카오 로그인 처리
     1. 이메일로 조회
     2. 없으면 회원가입 처리
     3. 유저 생성 후 리턴
     */
    const userInfoFromKakao = await axios.get(
      'https://kapi.kakao.com/v2/user/me',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    if (!userInfoFromKakao) {
      throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
    }

    const user = await this.userRepository.findOne({
      where: {
        email: userInfoFromKakao.data.kakao_account.email,
      },
    });

    if (user) {
      throw new ConflictException(HttpErrorConstants.EXIST_EMAIL);
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

  async getUserByGoogleAccessToken(dto: SocialLoginUserDto): Promise<User> {
    /** 이메일, 닉네임, 소셜 타입을 받아서 구글 로그인 처리
     1. 이메일로 조회
     2. 없으면 회원가입 처리
     3. 유저 생성 후 리턴
     */

    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });
    if (user) {
      throw new ConflictException(HttpErrorConstants.EXIST_EMAIL);
    }

    const googleUser = await this.userService.createSocialUser(
      dto.email,
      dto.nickname,
      dto.socialType,
    );

    return googleUser;
  }

  async getUserByAppleAccessToken(
    accessToken: string,
    socialType: SocialMethodType.APPLE,
  ) {
    // 사용자 정보 가져오기
    const userInfoResponse = await axios.get(
      'https://appleid.apple.com/auth/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const { sub, email } = userInfoResponse.data;

    // 사용자 정보가 이미 등록되어 있는지 확인
    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // 사용자 정보가 없으면 새로 생성
      user = await this.userService.createSocialUser(
        email,
        userInfoResponse.data.name,
        socialType,
      );
      const appleUser = await this.userRepository.save(user);
      return appleUser;
    }
    return user;
  }

  // 우리 서버 전용 JWT 토큰 발행
  async generateAccessToken(userIdx: number): Promise<string> {
    const payload = { userIdx: userIdx };
    return this.jwtService.sign(payload);
  }
}
