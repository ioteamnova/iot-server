import { PartialType } from '@nestjs/swagger';
import { CreatePetWeightDto } from './create-pet-weight.dto';
export class UpdatePetWeightDto extends PartialType(CreatePetWeightDto) {}
