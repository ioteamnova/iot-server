import { Repository } from 'typeorm';
import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { ValueAnalyzer } from '../entities/value-analyzer.entity';

@CustomRepository(ValueAnalyzer)
export class ValueAnalyzerRepository extends Repository<ValueAnalyzer> {

}