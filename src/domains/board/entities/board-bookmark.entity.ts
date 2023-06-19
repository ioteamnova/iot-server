import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Bookmark extends BaseEntity {
  @Column()
  category: string;

  @Column()
  postIdx: number;

  @Column()
  userIdx: number;
}
