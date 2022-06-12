import { Dict } from '@/types/common';

export const isDict = (arg: unknown): arg is Dict => (
  arg !== undefined && arg !== null && Object.getPrototypeOf(arg) === Object.prototype
);

export const isOneOf = <T extends string>(arg: string, list: T[]): arg is T => (
  (list as string[]).includes(arg)
);
