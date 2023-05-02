import * as moment from 'moment-timezone';
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
    default: moment().format('YYYY-MM-DD'),
    type: 'string',
    format: 'YYYY-mm-dd',
    required: true,
  })
  @IsNotEmpty()
  date: Date;
}
