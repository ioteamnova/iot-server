import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { UserRepository } from '../user/repositories/user.repository';
import { PetRepository } from '../diary/repositories/pet.repository';
import { DiaryRepository } from '../diary/repositories/diary.repository';
import { DiaryImageRepository } from '../diary/repositories/diary-image.repository';
import { PetWeightRepository } from '../diary/repositories/pet-weight.repository';
import { Boardcontroller } from './board.controller';
import { BoardService } from './board.service';
import { BoardRepository } from './repositories/create-Board.repository';
import { BoardImageRepository } from './repositories/board-image.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BoardRepository,
      BoardImageRepository,
    ]),
  ],
  controllers: [Boardcontroller],
  providers: [BoardService],
  exports: [BoardService, TypeOrmExModule],
})
export class BoardModule {}
