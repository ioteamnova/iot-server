import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class Page<T> {
  pageSize: number;
  totalCount: number;
  totalPage: number;
  existsNextPage: boolean;
  items: T[];
  result: Promise<any[]>;

  constructor(totalCount: number, items: T[], pageRequest: PageRequest) {
    this.pageSize = Number(pageRequest.size);
    this.totalCount = totalCount;
    this.totalPage = Math.ceil(totalCount / (pageRequest.size || 20));
    this.existsNextPage = this.totalPage > (pageRequest.page || 1);
    this.items = items;
  }
}

export class PageRequest {
  @ApiProperty({
    description: '페이지 번호',
    nullable: true,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: '페이지당 개수',
    nullable: true,
    required: false,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  size?: number = 20;

  @ApiProperty({
    description: '정렬',
    required: false,
    default: 'DESC',
    enum: ['DESC', 'ASC'],
  })
  @IsOptional()
  order?: 'DESC' | 'ASC';

  get offset(): number {
    return ((this.page || 1) - 1) * (this.size || 20);
  }

  get limit(): number {
    return this.size || 20;
  }

  existsNextPage(totalCount: number): boolean {
    const totalPage = totalCount / (this.size || 20);
    return totalPage > (this.page || 1);
  }
}
