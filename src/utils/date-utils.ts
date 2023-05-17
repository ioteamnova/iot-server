import * as moment from 'moment-timezone';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

export default class DateUtils {
  private static timezone = 'Asia/Seoul';
  private static moment = moment().tz(DateUtils.timezone);

  // ex) 2023-05-17 15:40:08
  static momentNow(): string {
    return moment().tz(DateUtils.timezone).format(timeFormat);
  }

  // ex) 2023-05-17T06:40:08.000Z
  static momentNowDate(): Date {
    return moment().tz(DateUtils.timezone).toDate();
  }

  // ex) 20230517165408
  static momentFile(): string {
    return this.moment.format('YYYYMMDDHHmmss');
  }

  // 0:일 1:월 ... 6:토
  static momentDay(): number {
    return this.moment.day();
  }

  // ex) 18:00
  static momentTime(): string {
    return this.moment.format('HH:mm');
  }

  // 문자 -> 날짜 ex) 2023-05-17T07:54:08.000Z
  static stringToDate(date: string): Date {
    return moment(date).tz(this.timezone).toDate();
  }

  // 문자 -> 시간 ex) 2023-05-17T07:54:08.000Z
  static stringToTime(date: string): Date {
    return moment(date, 'HH:mm').tz(this.timezone).toDate();
  }
}
