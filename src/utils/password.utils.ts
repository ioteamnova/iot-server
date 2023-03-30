import * as bcrypt from 'bcrypt';

export const hashPassword = (plainText: string): string => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(plainText, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

//비밀번호 정책 정규식
// - 영문, 숫자, 특수문자 조합 8자 이상
// - 최대 64자인데 UI에는 표기하지 않음
//
// ex) HakWon123#, hakwon123#
export const PasswordRegex =
  /^(?=.*[a-zA-Z])(?=.*[!@#$^*+=-])(?=.*[0-9]).{8,64}$/;
