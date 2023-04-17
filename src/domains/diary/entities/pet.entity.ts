import BaseEntity from 'src/core/entity/base.entity';
import { Column } from 'typeorm';

export class Pet extends BaseEntity {
  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  gender: string;

  @Column()
  birth_date: string;

  @Column()
  adoption_date: boolean;

  @Column()
  weight: boolean;
}
