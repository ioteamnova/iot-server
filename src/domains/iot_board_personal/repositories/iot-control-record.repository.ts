import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { IotControlRecord } from '../entities/iot-control-record.entity';

@CustomRepository(IotControlRecord)
export class IotControlrecordRepository extends Repository<IotControlRecord> { }
