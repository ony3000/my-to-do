import { FocusEventHandler, MouseEventHandler } from 'react';

export type Dict<T = unknown> = Record<string, T>;

export type Nullable<T> = T | null;

export type ReactFocusEvent<T> = Parameters<FocusEventHandler<T>>[0];

export type ReactMouseEvent<T> = Parameters<MouseEventHandler<T>>[0];

export type ListOption = 'CHANGE_THEME' | 'TOGGLE_COMPLETED_ITEMS';

export type OrderingCriterion = 'IMPORTANCE' | 'DEADLINE' | 'MYDAY' | 'TITLE' | 'CREATION_DATE';

export type OrderingDirection = 'ASCENDING' | 'DESCENDING';

// TODO: Replace to enum
/** @deprecated */
export type LegacyThemeColor = 'blue' | 'red' | 'violet' | 'lime' | 'amber';
