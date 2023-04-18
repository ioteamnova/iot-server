import { CreateDiaryDto } from './../dto/create-diary.dto';
import BaseEntity from 'src/core/entity/base.entity';
import { Column, ManyToOne } from 'typeorm';
import { Pet } from './pet.entity';

export class Diary extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  petIdx: number;

  // todo: 다이어리 이미지 테이블과 OneToMany

  @ManyToOne(() => Pet, (pet) => pet.diaries)
  pet: Pet;

  static from({ title, content }: { title: string; content: string }) {
    const diary = new Diary();
    diary.title = title;
    diary.content = content;
    return diary;
  }
}
