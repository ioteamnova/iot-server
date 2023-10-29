import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class MoffList extends BaseEntity {
  @Column({
    nullable: false,
    length: 150,
  })
  category: string;

  @Column({
    nullable: false,
    length: 150,
  })
  name: string;

  @Column({
    nullable: false,
    length: 150,
  })
  moff_recommend: string;
}
