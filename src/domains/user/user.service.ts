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
import { validatePassword } from 'src/utils/password.utils';

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

    const user = User.fromDto(dto);

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
  async sendMemberJoinEmail(email: string) {
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
      isPremium: userInfo.isPremium,
      agreeWithMarketing: userInfo.agreeWithMarketing,
      createdAt: userInfo.createdAt,
    };
  }

  /**
   * 유저 정보 수정
   * @param userIdx 유저 인덱스
   * @param dto 업데이트 dto
   * @returns 업데이트한 유저 정보
   */
  async update(userIdx: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        idx: userIdx,
      },
    });

    if (!user) {
      throw new NotFoundException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    user.updateFromDto(dto);
    return await this.userRepository.save(user);
  }

  /**
   * 닉네임 중복 검사
   * @param dto.nickname 변경할 닉네임
   * @returns boolean
   */
  async checkExistNickname(nickname: string) {
    const isExistNickname = await this.userRepository.exist({
      where: {
        nickname: nickname,
      },
    });

    if (isExistNickname) {
      throw new ConflictException(HttpErrorConstants.EXIST_NICKNAME);
    }

    return isExistNickname;
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
