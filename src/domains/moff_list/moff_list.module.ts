import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/core/typeorm-ex.module';
import { MoffListController } from './moff_list.controller';
import { MoffListService } from './moff_list.service';
import { MoffListRepository } from './repositories/moff-list.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([MoffListRepository])],
  controllers: [MoffListController],
  providers: [MoffListService],
})
export class MoffListModule {}
