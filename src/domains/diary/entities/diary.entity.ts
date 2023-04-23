import { CreateDiaryDto } from '../dtos/create-diary.dto';
import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Pet } from './pet.entity';
import { UpdateDiaryDto } from '../dtos/update-diary.dto';
import { DiaryImage } from './diary-image.entity';
@Entity()
export class Diary extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  petIdx: number;

  @OneToMany(() => DiaryImage, (image) => image.diary)
  images: DiaryImage[];

  @ManyToOne(() => Pet, (pet) => pet.diaries)
  pet: Pet;

  static from({ title, content }: { title: string; content: string }) {
    const diary = new Diary();
    diary.title = title;
    diary.content = content;
    return diary;
  }

  updateFromDto(dto: UpdateDiaryDto) {
    this.title = dto.title;
    this.content = dto.content;
    // this.images = dto.imagePaths.map((imagePath) => {
    //   const image = new DiaryImage();
    //   image.imagePath = imagePath;
    //   image.diary = this;
    //   return image;
    // });
  }
}
