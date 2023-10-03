import { Diary } from './diary.entity';
import BaseEntity from 'src/core/entity/base.entity';
import { Column, ManyToOne, Entity, JoinColumn } from 'typeorm';

@Entity()
export class DiaryImage extends BaseEntity {
  @Column()
  diaryIdx: number;

  @Column()
  imagePath: string;

  @ManyToOne(() => Diary, (diary) => diary.images)
  @JoinColumn({ name: 'diary_idx' })
  diary: Diary;
}
