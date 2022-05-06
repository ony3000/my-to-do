export type Dict<T = unknown> = Record<string, T>;

export type Nullable<T> = T | null;

export type ListOption = 'CHANGE_THEME' | 'TOGGLE_COMPLETED_ITEMS';

export type OrderingCriterion = 'IMPORTANCE' | 'DEADLINE' | 'MYDAY' | 'TITLE' | 'CREATION_DATE';

export type OrderingDirection = 'ASCENDING' | 'DESCENDING';

export type ThemeColor = 'blue' | 'red' | 'violet' | 'lime' | 'amber';
