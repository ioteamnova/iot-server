import { CreateScheduleDto } from '../dtos/create-schedule.dto';
import { User } from 'src/domains/user/entities/user.entity';
import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UpdateScheduleDto } from '../dtos/update-schedule.dto';

@Entity()
export class Schedule extends BaseEntity {
  @Column()
  title: string;

  @Column()
  memo: string;

  @Column({
    unsigned: true,
  })
  userIdx: number;

  @Column()
  alarmTime: string;

  @Column({
    comment: `일~월요일에서 알림을 설정한 날을 1과 0으로 표현한다.
    ex) 월,수,금 반복인경우 0,1,0,1,0,1,0`,
  })
  repeat: string;

  @ManyToOne(() => User, (user) => user.schedules)
  @JoinColumn({ name: 'user_idx' })
  user: User;

  static from(dto: CreateScheduleDto) {
    const schedule = new Schedule();
    schedule.title = dto.title;
    schedule.memo = dto.memo;
    schedule.alarmTime = dto.alarmTime;
    schedule.repeat = dto.repeat;
    // schedule.repeat = JSON.stringify(dto.repeat);

    return schedule;
  }

  updateFromDto(dto: UpdateScheduleDto) {
    this.title = dto.title;
    this.memo = dto.memo;
    this.alarmTime = dto.alarmTime;
    // this.repeat = JSON.stringify(dto.repeat);
    this.repeat = dto.repeat;
  }
}
