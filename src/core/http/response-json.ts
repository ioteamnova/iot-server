import status from 'http-status-codes';

export default function responseJson<T>(
  status: number,
  object?: T,
): { status: number; message: string; result?: T | unknown } {
  if (object === undefined) {
    return {
      status: status,
      message: statusMessage(status),
      result: object,
    };
  }

  return {
    status: status,
    message: statusMessage(status),
    result: object,
  };
}

export function statusMessage(httpStatus: number): string {
  switch (httpStatus) {
    // 200:OK
    case status.OK:
      return 'Success';
    // 201:CREATED
    case status.CREATED:
      return 'Created';
    // 400:BAD_REQUEST - 잘못된 요청
    case status.BAD_REQUEST:
      return 'Bad Request';
    // 401:UNAUTHORIZED - 인증되지 않음. 로그인 하지 않음
    case status.UNAUTHORIZED:
      return 'Unauthorized';
    // 403:FORBIDDEN - 요청을 인지했지만, 거절함. 권한 없음
    case status.FORBIDDEN:
      return 'Forbidden';
    // 404:NOT_FOUND - 요청한 리소스를 찾을 수 없음
    case status.NOT_FOUND:
      return 'Not Found';
    // 409:CONFLICT - 기존 리소스와 충돌하는 요청
    case status.CONFLICT:
      return 'Conflict';
    // 419: AUTHENTICATION TIMEOUT - 이전에 유효한 인증이 만료되었습니다.
    case 419:
      return 'Token Expired';
    // 422:UNPROCESSABLE_ENTITY - 필요한 엔티티를 전달받지 못함
    case status.UNPROCESSABLE_ENTITY:
      return 'Unprocessable Entity';
    // 429:TOO_MANY_REQUEST - 너무 많은 요청
    case status.TOO_MANY_REQUESTS:
      return 'Too Many Request';
    // 500:INTERNAL_SEVER_ERROR - 서버 내부 에러 발생, 예외 처리 되지 않은 에러 발생
    case status.INTERNAL_SERVER_ERROR:
      return 'Internal Error';
    default:
      return 'Server Error';
  }
}
