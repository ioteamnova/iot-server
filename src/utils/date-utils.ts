import * as moment from 'moment-timezone';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

export default class DateUtils {
  private static timezone = 'Asia/Seoul';
  private static moment = moment().tz(DateUtils.timezone);

  static momentNow(): string {
    return DateUtils.moment.format(timeFormat);
  }

  static momentNowDate(): Date {
    return moment().tz('Asia/Seoul').toDate();
  }

  static momentFile(): string {
    return moment().tz('Asia/Seoul').format('YYYYMMDDHHmmss');
  }

  static momentYMD(date: Date): string {
    return moment(date).tz(DateUtils.timezone).format('YYYY-MM-DD');
  }
}
