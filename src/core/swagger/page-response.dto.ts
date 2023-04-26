import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { Page } from '../page';
import { ResponseDto } from './response-dto';

export class PageResponseDto<T> extends ResponseDto<T> {
  @IsOptional()
  @Type(() => Page)
  @ValidateNested()
  @ApiProperty({
    description: '페이징한 데이터',
  })
  readonly result: Page<T>;
}
