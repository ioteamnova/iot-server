import winston, { createLogger, format, transports } from 'winston';
// import moment from 'moment-timezone';
// import { isLocalMode } from '@utils/app-utils';
// import { httpContext } from '@core/http/http-context';

// moment.tz('Asia/Seoul').format();
// 프로덕션시 AWS cloudWatch에 올라가는데, 로그에 컬러가 있으면 컬러값 문자열이 로그에 표시돼 보기 불편해짐. 이에 프로덕션 시에는 컬러 안나오도록 대응하였음
// const cloudwatchLogFormat = format.combine(winston.format.json()); // cloudWatch에서 사용하기 좋게  json으로 변환
// const devLogFormat = format.combine(
//   format.colorize({ all: true }),

//   format.printf(({ level, message, label, timestamp }) => {
//     return `${timestamp} [${label}] ${level}: ${message}`;
//   }),
// );
// const defaultLogFormat = format.combine(
//   format((info) => {
//     info.level = info.level.toUpperCase();

//     // if 있으면s
//     // info.userIdx = ~~~;

//     info = {
//       ...info,
//       _userIdx: httpContext.get('userIdx'),
//       _clientIp: httpContext.get('clientIp'),
//       _requestId: httpContext.get('requestId'),
//       _userAgent: httpContext.get('userAgent'),
//       _uri: httpContext.get('requestUri'),
//     };

//     return info;
//   })(),
//   format.timestamp({
//     format: 'YYYY-MM-DD HH:mm:ss.SSS',
//   }),
//   format.splat(), // %o 로 오브젝트를 로깅하기 위함
//   format.label({ label: 'picasso-ts-node' }),
//   isLocalMode ? devLogFormat : cloudwatchLogFormat,
// );

export const logger = createLogger({
  //   format: defaultLogFormat,
  transports: [new transports.Console({})],
});
