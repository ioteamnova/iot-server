import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { MorphListController } from './morph_list.controller';
import { MorphListService } from './morph_list.service';
import { MorphListRepository } from './repositories/morph-list.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([MorphListRepository])],
  controllers: [MorphListController],
  providers: [MorphListService],
})
export class MorphListModule {}
