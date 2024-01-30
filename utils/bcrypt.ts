import * as bcrypt from 'bcrypt';

export async function encodePassword(password: string) {
  const SALT = bcrypt.genSaltSync();
  return await bcrypt.hash(password, SALT);
}

export function decodePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}
