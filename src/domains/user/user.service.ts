import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
   *  회원가입 API
   * @param createUserDto 유저 dto
   * @returns user
   */
  async createUser(createUserDto: CreateUserDto) {
    await this.checkExistEmail(createUserDto.email);

    const signupVerifyToken = uuid.v1();

    await this.sendMemberJoinEmail(createUserDto.email, signupVerifyToken);

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
   * @param
   * @returns
   */
  async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  /**
   * 이메일 인증
   * @param signupVerifyToken
   * @returns
   */
  // async verifyEmail(signupVerifyToken: string): Promise<string> {
  //   const user = await this.userRepository.findOne({
  //     where: { signupVerifyToken },
  //   });

  //   if (!user) {
  //     throw new NotFoundException(HttpErrorConstants.USER_NOT_FOUND);
  //   }

  //   return this.authService.login({
  //     idx: user.idx,

  //   })
  // }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
