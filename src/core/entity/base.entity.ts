import {
  BaseEntity as BaseTypeormEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export default abstract class BaseEntity extends BaseTypeormEntity {
  @PrimaryGeneratedColumn({
    comment: '인덱스',
    unsigned: true,
    type: 'integer',
  })
  idx: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ default: null })
  deletedAt: Date | null;
}
