import BaseEntity from 'src/core/entity/base.entity';
import { Schedule } from 'src/domains/schedule/entities/schedule.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class FbToken extends BaseEntity {
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
  fbToken: string;

  // // FbToken 엔티티와 Schedule 엔티티 간의 관계 설정
  // @ManyToOne(() => Schedule, (schedule) => schedule.fbToken)
  // schedule: Schedule;

}
