import { UpdatePasswordDto } from './dtos/update-password.dto';
import {
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
import DeleteUserDto from './dtos/delete-user.dto';
import { hashPassword, validatePassword } from 'src/utils/password.utils';
import { asyncUploadToS3, S3FolderName } from 'src/utils/s3-utils';
import DateUtils from 'src/utils/date-utils';
import { SocialMethodType } from '../auth/helpers/constants';
import { FindPasswordDto } from './dtos/find-password.dto';
import { UserInfoResponseDto } from './dtos/user-info-response.dto';
import { VerifyEmailResponseDto } from './dtos/verify-email-response.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
  ) {}
  /**
   *  회원가입
   * @param dto 유저 dto
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
  ) {
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
  async sendMemberJoinEmail(email: string): Promise<VerifyEmailResponseDto> {
    const signupVerifyToken = uuid.v1();
    await this.emailService.sendVerificationEmail(email, signupVerifyToken);
    return { signupVerifyToken: signupVerifyToken };
  }

  /**
   * 내 정보 조회
   * @param userIdx 유저 인덱스
   * @returns 조회한 유저 정보
   */
  async getUserInfo(userIdx: number) {
    const userInfo = await this.userRepository.findOne({
      where: { idx: userIdx },
    });

    if (!userInfo) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }
    return {
      idx: userInfo.idx,
      email: userInfo.email,
      nickname: userInfo.nickname,
      profilePath: userInfo.profilePath,
      isPremium: userInfo.isPremium,
      agreeWithMarketing: userInfo.agreeWithMarketing,
      createdAt: userInfo.createdAt,
      loginMethod: userInfo.loginMethod,
    };
  }

  /**
   * 유저 정보 수정
   * @param userIdx 유저 인덱스
   * @param dto 업데이트 dto
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
    const user = await this.userRepository.findOne({
      where: {
        idx: userIdx,
      },
    });

    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
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

    const result = user.updateFromDto(dto);
    await this.userRepository.save(user);
    return result;
  }

  /**
   * 닉네임 중복 검사
   * @param dto.nickname 설정할 닉네임
   * @returns boolean
   */
  async checkExistNickname(nickname: string) {
    const isExistNickname = await this.userRepository.existByNickname(nickname);

    if (isExistNickname) {
      throw new ConflictException(HttpErrorConstants.EXIST_NICKNAME);
    }

    return isExistNickname;
  }

  /**
   * 비밀번호 변경
   * @param userIdx 유저인덱스
   * @param dto 비밀번호 변경 dto
   */
  async updatePassword(userIdx: number, dto: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({
      where: {
        idx: userIdx,
      },
    });

    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }
    // 유저가 입력한 현재 비밀번호와 db에 저장되어있는 비밀번호를 비교
    await validatePassword(dto.currentPassword, user.password);

    user.password = hashPassword(dto.newPassword);
    await this.userRepository.save(user);
  }

  /**
   * 비밀번호 찾기
   * @param dto 비밀번호 찾기 dto
   */
  async findPassword(dto: FindPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }
    // 유저가 입력한 새 비밀번호 암호화
    const newPassword = hashPassword(dto.password);
    user.password = newPassword;
    await this.userRepository.update(
      {
        idx: user.idx,
      },
      {
        password: newPassword,
      },
    );
  }

  /**
   * 회원 탈퇴
   * @param DeleteUserDto
   * @returns
   */
  async removeByPassword(dto: DeleteUserDto, userIdx: number) {
    const { password } = dto;

    const user = await this.userRepository.findOne({
      where: {
        idx: userIdx,
      },
    });

    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    await validatePassword(password, user.password);

    await this.userRepository.softDelete(userIdx);
  }
}
