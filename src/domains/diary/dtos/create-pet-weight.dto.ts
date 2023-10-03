import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePetWeightDto {
  @ApiProperty({
    description: '체중 (g)',
    default: 100.0,
    type: 'float',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @ApiProperty({
    description: '날짜',
    default: '2023-06-02',
    type: 'date',
    format: 'YYYY-MM-dd',
    required: true,
  })
  @IsNotEmpty()
  date: Date;
}
