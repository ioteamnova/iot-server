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

  async existByNickname(nickname: string): Promise<boolean> {
    const existNickname = await this.exist({
      where: {
        nickname,
      },
    });
    return existNickname;
  }

  async findByUserIdx(userIdx: number): Promise<User> {
    const user = await this.findOne({
      where: {
        idx: userIdx,
      },
    });
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.findOne({
      where: {
        email: email,
      },
    });
    return user;
  }

  async updateFirebaseTokenByUserIdx(userIdx: number, fbToken: string) {
    const user = await this.update(userIdx, { fbToken: fbToken });
  }

  // async findByfbTokens(tokens: string[]): Promise<User[]> {
  //   return await this.createQueryBuilder('user')
  //     .select(['user.idx', 'user.fbToken'])
  //     // .select('user.idx')
  //     // .addSelect('user.fbToken')
  //     .where('user.fbToken IN (:...tokens)', { tokens })
  //     .getMany();
  // }
}
