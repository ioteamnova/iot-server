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

  // 파일 이름에 붙힐 DateTime 포맷
  static momentFile(): string {
    return moment().tz('Asia/Seoul').format('YYYYMMDDHHmmss');
  }
}
