import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePetDto } from './create-pet.dto';
export class PetResponseDto extends PartialType(CreatePetDto) {
  @ApiProperty({
    description: '반려동물 인덱스',
    default: 1,
  })
  idx: number;

  @ApiProperty({
    description: '이미지 경로',
    default: null,
  })
  imagePath: string;
}
