import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HttpErrorConstants } from 'src/core/http/http-error-objects';

export const hashPassword = (plainText: string): string => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(plainText, salt);
};

// compare hashed with plain text
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// 패스워드 검증
export const validatePassword = async (
  password: string,
  hashedPassword: string,
): Promise<void> => {
  const equalsPassword = await comparePassword(password, hashedPassword);

  // 비밀번호 틀릴 떄,
  if (!equalsPassword) {
    throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
  }
};
