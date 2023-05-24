import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import { Repository } from 'typeorm';
import { IotAuthInfo } from '../entities/iot-auth-info.entity';

@CustomRepository(IotAuthInfo)
export class IotAuthInfoRepository extends Repository<IotAuthInfo> {
  findCurrentOneData(): Promise<IotAuthInfo> {
    return this.createQueryBuilder('iotauth').orderBy('idx', 'DESC').getOne();
  }

  chkAuthInfoDuplicate(boardSerial: string): Promise<IotAuthInfo> {
    return this.createQueryBuilder('iotauth')
      .where({ boardSerial: boardSerial })
      .orderBy('idx', 'DESC')
      .getOne();
  }
}
