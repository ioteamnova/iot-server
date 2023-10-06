import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class RefToken extends BaseEntity {
  @Column()
  userIdx: number;

  @Column({
    nullable: false,
    length: 45,
  })
  platform: string;

  @Column({
    nullable: true,
    default: null,
  })
  refToken: string;

}
