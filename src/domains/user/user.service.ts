import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  /**
   *  회원가입 API
   * @param createUserDto 유저 dtos
   */
  async create(createUserDto: CreateUserDto) {
    const {
      email,
      password,
      nickname,
      profilePath,
      isPremium,
      agreeWithEmail,
    } = createUserDto;
    const user = new User();
    user.email = email;
    user.password = password;
    user.nickname = nickname;
    user.profilePath = profilePath;
    user.isPremium = isPremium;
    user.agreeWithEmail = agreeWithEmail;

    const saveUser = await this.userRepository.save(user);

    return saveUser;
  }

  findAll() {
    return `This action returns all user`;
  }

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
