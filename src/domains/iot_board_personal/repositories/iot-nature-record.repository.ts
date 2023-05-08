import { Injectable } from '@nestjs/common';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { PageRequest } from 'src/core/page';
import { EntityRepository, Repository } from "typeorm";
import { IotNatureRecord } from '../entities/iot-nature-record.entity';



@CustomRepository(IotNatureRecord)
export class IotNaturerecordRepository extends Repository<IotNatureRecord> {
}