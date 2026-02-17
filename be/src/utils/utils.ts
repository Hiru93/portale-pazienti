import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

export const saltGen = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const compareHash = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const result = await bcrypt.compare(password, hash);
  return result;
};

export const sanitizeNumber = (
  num: string | number,
  isPhone?: boolean,
): string | number => {
  const str = String(num);
  return isPhone ? '+'.concat(str.replace(/\D/g, '')) : str.replace(/\D/g, '');
};

export const sanitizeString = (str: string): string => {
  return str.replace(/[^a-zA-Z0-9]/g, '');
};

export const sanitizeDate = (date: string): string => {
  return moment(date).format('YYYY-MM-DD');
};

export const sanitizeEmail = (email: string): string => {
  return email.replace(/[^a-zA-Z0-9@.]/g, '').toLowerCase();
};

export const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};
