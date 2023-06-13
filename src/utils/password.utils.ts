import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';

// 비밀번호 암호화
export const hashPassword = (plainText: string): string => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(plainText, salt);
};

// 패스워드 검증
export const validatePassword = async (
  password: string,
  hashedPassword: string,
): Promise<void> => {
  const equalsPassword = await comparePassword(password, hashedPassword);

  if (!equalsPassword) {
    throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
  }
};

// 사용자가 입력한 비밀번호와 저장되어있는 비밀번호 비교
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * 비밀번호 정책 정규식
 *  - 영문, 숫자, 특수문자 조합 8자 이상
 *  - 최대 64자인데 UI에는 표기하지 않음
 *  ex) qwer123#
 */
export const PasswordRegex =
  /^(?=.*[a-zA-Z])(?=.*[!@#$^*+=-])(?=.*[0-9]).{8,64}$/;
