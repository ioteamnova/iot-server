import { UserInfoResponseDto } from './dtos/user-info-response.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import * as uuid from 'uuid';
import { EmailService } from '../email/email.service';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { hashPassword, validatePassword } from 'src/utils/password.utils';
import { asyncUploadToS3, S3FolderName } from 'src/utils/s3-utils';
import DateUtils from 'src/utils/date-utils';
import { SocialMethodType } from '../auth/helpers/constants';
import { FindPasswordDto } from './dtos/find-password.dto';
import { VerifyEmailResponseDto } from './dtos/verify-email-response.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { EmailVerifyType } from './helper/constant';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
  ) {}
  /**
   *  회원가입
   * @param dto CreateUserDto
   * @returns user
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    await this.checkExistEmail(dto.email);
    await this.checkExistNickname(dto.nickname);

    const user = User.from(dto);

    return await this.userRepository.save(user);
  }

  /**
   *  소셜 회원가입
   * @param dto 유저 dto
   * @returns user
   */
  async createSocialUser(
    email: string,
    nickname: string,
    socialType: SocialMethodType,
  ): Promise<User> {
    const password = hashPassword(uuid.v1());
    const user = new User();
    user.email = email;
    user.password = password;
    user.nickname = nickname;
    user.loginMethod =
      socialType === 'KAKAO'
        ? SocialMethodType.KAKAO
        : socialType === 'GOOGLE'
        ? SocialMethodType.GOOGLE
        : SocialMethodType.APPLE;

    return await this.userRepository.save(user);
  }

  /**
   * 이메일 중복검사
   * @param email 이메일
   * @returns boolean
   */
  async checkExistEmail(email: string): Promise<boolean> {
    const isExistEmail = await this.userRepository.existByEmail(email);

    if (isExistEmail) {
      throw new ConflictException(HttpErrorConstants.EXIST_EMAIL);
    }

    return isExistEmail;
  }

  /**
   * 이메일 전송
   * @param email 이메일
   * @returns 이메일 인증 토큰
   */
  async sendMemberJoinEmail(
    dto: VerifyEmailDto,
  ): Promise<VerifyEmailResponseDto> {
    const signupVerifyToken = uuid.v1();
    if (dto.type === EmailVerifyType.OLDUSER) {
      const existEmail = await this.userRepository.existByEmail(dto.email);
      if (!existEmail) {
        throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
      }
    }
    await this.emailService.sendVerificationEmail(dto.email, signupVerifyToken);
    return { signupVerifyToken: signupVerifyToken };
  }

  /**
   * 내 정보 조회
   * @param userIdx 유저 인덱스
   * @returns 패스워드, 삭제일 제외한 유저 정보
   */
  async getUserInfo(userIdx: number) {
    const userInfo = await this.userRepository.findByUserIdx(userIdx);

    if (!userInfo) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }
    return new UserInfoResponseDto(userInfo);
  }

  /**
   * 유저 정보 수정 (비밀번호 수정은 해당 API 사용 X)
   * @param userIdx 유저 인덱스
   * @param dto UpdateUserDto
   * @returns 업데이트한 유저 정보
   */
  async update(file: Express.Multer.File, dto: UpdateUserDto, userIdx: number) {
    // 이메일, 닉네임 중복 검사
    if (dto.email) {
      await this.checkExistEmail(dto.email);
    }
    if (dto.nickname) {
      await this.checkExistNickname(dto.nickname);
    }
    const user = await this.userRepository.findByUserIdx(userIdx);

    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    // 소셜로그인 유저이면 이메일 변경 불가
    if (user.loginMethod && dto.email) {
      throw new BadRequestException(
        HttpErrorConstants.CANNOT_UPDATE_SOCIAL_USER,
      );
    }

    if (file) {
      const folder = S3FolderName.PROFILE;
      const fileName = `${userIdx}-${DateUtils.momentFile()}-${uuid.v4()}-${
        file.originalname
      }`;
      const fileKey = `${folder}/${fileName}`;
      const result = await asyncUploadToS3(fileKey, file.buffer);

      dto.profilePath = result.Location;
    }

    const updateUserInfo = user.updateFromDto(dto);
    await this.userRepository.save(user);
    return updateUserInfo;
  }

  /**
   * 닉네임 중복 검사
   * @param dto.nickname 설정할 닉네임
   * @returns boolean
   */
  async checkExistNickname(nickname: string): Promise<boolean> {
    const isExistNickname = await this.userRepository.existByNickname(nickname);

    if (isExistNickname) {
      throw new ConflictException(HttpErrorConstants.EXIST_NICKNAME);
    }

    return isExistNickname;
  }

  /**
   * 비밀번호 변경
   * @param userIdx 유저인덱스
   * @param dto UpdatePasswordDto
   */
  async updatePassword(userIdx: number, dto: UpdatePasswordDto) {
    const user = await this.userRepository.findByUserIdx(userIdx);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }
    // 소셜로그인 유저는 비밀번호 변경 불가
    if (user.loginMethod) {
      throw new BadRequestException(
        HttpErrorConstants.CANNOT_UPDATE_SOCIAL_USER,
      );
    }

    await validatePassword(dto.currentPassword, user.password);
    const newPassword = hashPassword(dto.newPassword);
    await this.userRepository.updatePasswordByUserIdx(user.idx, newPassword);
  }

  /**
   * 비밀번호 찾기
   * @param dto FindPasswordDto
   */
  async findPassword(dto: FindPasswordDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    if (user.loginMethod) {
      throw new BadRequestException(
        HttpErrorConstants.CANNOT_UPDATE_SOCIAL_USER,
      );
    }

    const newPassword = hashPassword(dto.password);
    await this.userRepository.updatePasswordByUserIdx(user.idx, newPassword);
  }

  /**
   * 회원 탈퇴
   * @param dto DeleteUserDto
   */
  async removeByPassword(dto: DeleteUserDto, userIdx: number) {
    const password = dto.password;

    const user = await this.userRepository.findByUserIdx(userIdx);
    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    await validatePassword(password, user.password);
    await this.userRepository.softDelete(userIdx);
  }
}
