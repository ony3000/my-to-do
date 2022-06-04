import { Dict } from '@/types/common';

export const isDict = (arg: unknown): arg is Dict => (
  arg !== undefined && arg !== null && Object.getPrototypeOf(arg) === Object.prototype
);
