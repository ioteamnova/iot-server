/**
 * HTTP error code 관련 상수
 */

export interface HttpErrorFormat {
  errorCode: string;
  description?: string;
  message: string;
}

export const HttpErrorConstants = {
  UNAUTHORIZED: {
    errorCode: 'UNAUTHORIZED',
    message: '로그인이 필요합니다.',
  } as HttpErrorFormat,

  FORBIDDEN: {
    errorCode: 'FORBIDDEN',
    message: '권한이 없습니다.',
  } as HttpErrorFormat,

  INTERNAL_SERVER_ERROR: {
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: '알 수 없는 오류가 발생하였습니다.',
  } as HttpErrorFormat,

  EXIST_EMAIL: {
    errorCode: 'EXIST_EMAIL',
    message: '이미 가입된 이메일입니다.',
  } as HttpErrorFormat,

  EXIST_NICKNAME: {
    errorCode: 'EXIST_EXIST_NICKNAME',
    message: '이미 사용중인 닉네임입니다.',
  } as HttpErrorFormat,

  INVALID_AUTH: {
    errorCode: 'UNAUTHORIZED',
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  } as HttpErrorFormat,

  CANNOT_FIND_USER: {
    errorCode: 'CANNOT_FIND_USER',
    message: '유저를 찾을 수 없습니다.',
  } as HttpErrorFormat,

  AUTH_LINK_EXPIRED: {
    errorCode: 'AUTH_LINK_EXPIRED',
    message:
      '이 메일링크는 이미 사용됐거나, 만료되었습니다(24시간 초과). 메일 인증을 다시 진행해주세요.',
  } as HttpErrorFormat,

  AUTH_TYPE_INVALID: {
    errorCode: 'AUTH_TYPE_INVALID',
    message: '이메일 인증 유형이 유효하지 않습니다.',
  } as HttpErrorFormat,
};
