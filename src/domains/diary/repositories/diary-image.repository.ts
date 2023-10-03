import { CustomRepository } from 'src/core/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { DiaryImage } from '../entities/diary-image.entity';

@CustomRepository(DiaryImage)
export class DiaryImageRepository extends Repository<DiaryImage> {}
