import { CreateScheduleDto } from '../dtos/create-schedule.dto';
import { User } from 'src/domains/user/entities/user.entity';
import BaseEntity from 'src/core/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UpdateScheduleDto } from '../dtos/update-schedule.dto';
import { SchedulesType } from '../helper/constants';

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
  repeatDay: string;

  @Column()
  type: SchedulesType;

  @Column()
  date: string;

  @ManyToOne(() => User, (user) => user.schedules)
  @JoinColumn({ name: 'user_idx' })
  user: User;

  static from({
    title,
    memo,
    alarmTime,
    repeatDay,
    type,
    date,
  }: {
    title: string;
    memo: string;
    alarmTime: string;
    repeatDay: string;
    type: SchedulesType;
    date: string;
  }) {
    const schedule = new Schedule();
    schedule.title = title;
    schedule.memo = memo;
    schedule.alarmTime = alarmTime;
    schedule.repeatDay = repeatDay;
    schedule.type = type;
    schedule.date = date;

    return schedule;
  }

  updateFromDto(dto: UpdateScheduleDto) {
    this.title = dto.title;
    this.memo = dto.memo;
    this.alarmTime = dto.alarmTime;
    // this.repeat = JSON.stringify(dto.repeat);
    this.repeatDay = dto.repeatDay;
    this.date = dto.date;
  }
}
