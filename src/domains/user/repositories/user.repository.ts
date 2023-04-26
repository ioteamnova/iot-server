import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async existByEmail(email: string): Promise<boolean> {
    const existEmail = await this.exist({
      where: {
        email,
      },
    });
    return existEmail;
  }

  async existByNcikname(nickname: string): Promise<boolean> {
    const existNickname = await this.exist({
      where: {
        nickname,
      },
    });
    return existNickname;
  }
}
