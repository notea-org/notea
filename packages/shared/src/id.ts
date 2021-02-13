import md5 from 'md5';
import { customAlphabet } from 'nanoid';

export function genMd5(str: string, len = 8): string {
  return md5(str).slice(0, len);
}

export const genFriendlyId = customAlphabet(
  '23456789abcdefghjkmnpqrstuvwxyz',
  4
);
