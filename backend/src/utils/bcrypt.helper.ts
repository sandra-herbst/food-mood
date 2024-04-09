import * as bcrypt from 'bcrypt';

/**
 * Encodes a string with a generated salt.
 * @param password: string that gets encoded.
 */
export const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};
