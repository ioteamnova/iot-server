import * as moment from 'moment-timezone';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

export default class DateUtils {
  private static timezone = 'Asia/Seoul';
  private static moment = moment().tz(DateUtils.timezone);

  // 현재시간 가져오기 (string 타입)
  static momentNow(): string {
    return DateUtils.moment.format(timeFormat);
  }

  // 현재시간 가져오기 (Date 타입)
  static momentNowDate(): Date {
    return new Date(DateUtils.momentNow());
  }

  // 파일 이름에 붙힐 DateTime
  static momentFile(): string {
    return moment().tz('Asia/Seoul').format('YYYYMMDDHHmmss');
  }

  // 요일을 가져오는 함수. 0:일 1:월 ... 6:토
  static momentDay(): number {
    return DateUtils.moment.day();
  }

  static momentTime(): string {
    return moment().tz(DateUtils.timezone).format('HH:mm');
  }

  static stringToDate(date: string): Date {
    return moment(date).tz(DateUtils.timezone).toDate();
  }

  static stringToTime(date: string): Date {
    return moment(date, 'HH:mm').tz(DateUtils.timezone).toDate();
  }
}
