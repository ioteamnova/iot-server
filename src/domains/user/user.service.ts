// import { AuthService } from './../auth/auth.service';
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

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
  ) {}
  /**
   *  회원가입
   * @param createUserDto 유저 dto
   * @returns user
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    await this.checkExistEmail(createUserDto.email);

    const user = User.from(createUserDto);

    return await this.userRepository.save(user);
  }

  /**
   * 이메일 중복검사
   * @param email
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
   * @param email
   * @returns signupVerifyToken
   */
  async sendMemberJoinEmail(email: string) {
    const signupVerifyToken = uuid.v1();
    await this.emailService.sendVerificationEmail(email, signupVerifyToken);
    return { signupVerifyToken: signupVerifyToken };
  }

  /**
   * 내 정보 조회
   * @param user 유저
   * @returns 유저 정보
   */
  async getUserInfo(user: User) {
    const userInfo = await this.userRepository.findOne({
      where: { idx: user.idx },
    });
    console.log('userInfo:::', userInfo);
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
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
