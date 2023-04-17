import { PartialType } from '@nestjs/swagger';
import { CreateDiaryDto } from './create-diary.dto';

export class UpdateDiaryDto extends PartialType(CreateDiaryDto) {}
