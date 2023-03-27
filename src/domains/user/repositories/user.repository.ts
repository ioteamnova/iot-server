import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {}

// 레포지토리 파일 생성
