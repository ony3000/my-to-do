import {
  Nullable,
  ListOption,
  OrderingCriterion,
  OrderingDirection,
  LegacyThemeColor,
} from '@/lib/types/common';

export type TodoItemBase = {
  id: string;
  title: string;
  isComplete: boolean;
  createdAt: number;
};

export type TodoItem = TodoItemBase & {
  subSteps: TodoItemBase[];
  isImportant: boolean;
  isMarkedAsTodayTask: boolean;
  deadline: Nullable<number>;
  memo: string;
  completedAt: Nullable<number>;
  markedAsImportantAt: Nullable<number>;
  markedAsTodayTaskAt: Nullable<number>;
};

export type SettingsPerPage = {
  themeColor?: LegacyThemeColor;
  isHideCompletedItems?: boolean;
  ordering?: Nullable<{
    criterion: OrderingCriterion;
    direction: OrderingDirection;
  }>;
};

export type TodoAppState = {
  isAppReady: boolean;
  isActiveSearchBox: boolean;
  isActiveSidebar: boolean;
  isActiveSettingPanel: boolean;
  settings: {
    general: {
      confirmBeforeRemoving: boolean;
      moveImportantTask: boolean;
    };
    smartList: {
      important: boolean;
      planned: boolean;
      all: boolean;
      completed: boolean;
      autoHideEmptyLists: boolean;
    };
  };
  todoItems: TodoItem[];
  listOptionPosition: Nullable<{
    top: number;
    left: number;
  }>;
  themePalettePosition: Nullable<{
    top: number;
    left: number;
  }>;
  orderingCriterionPosition: Nullable<
    | {
        top: number;
        right?: undefined;
        left: number;
      }
    | {
        top: number;
        right: number;
        left?: undefined;
      }
  >;
  deadlinePickerPosition: Nullable<{
    top: number;
    right: number;
  }>;
  deadlineCalendarPosition: Nullable<{
    top: number;
    right: number;
  }>;
  toolbarFunctions: {
    myday: {
      listOption?: null;
      listOrdering: OrderingCriterion[];
    };
    important: {
      listOption: ListOption[];
      listOrdering?: null;
    };
    planned: {
      listOption: ListOption[];
      listOrdering?: null;
    };
    all: {
      listOption: ListOption[];
      listOrdering?: null;
    };
    completed: {
      listOption: ListOption[];
      listOrdering?: null;
    };
    inbox: {
      listOption: ListOption[];
      listOrdering: OrderingCriterion[];
    };
    search: {
      listOption: ListOption[];
      listOrdering?: null;
    };
    'search/[keyword]': {
      listOption: ListOption[];
      listOrdering?: null;
    };
  };
  pageSettings: {
    myday: Required<Pick<SettingsPerPage, 'ordering'>>;
    important: Required<Pick<SettingsPerPage, 'isHideCompletedItems'>>;
    planned: Required<Pick<SettingsPerPage, 'isHideCompletedItems'>>;
    all: Required<Pick<SettingsPerPage, 'themeColor'>>;
    completed: Required<Pick<SettingsPerPage, 'themeColor'>>;
    inbox: Required<Pick<SettingsPerPage, 'themeColor' | 'ordering'>>;
    search: Required<Pick<SettingsPerPage, 'isHideCompletedItems'>>;
    'search/[keyword]': Required<Pick<SettingsPerPage, 'isHideCompletedItems'>>;
  };
  focusedTaskId: Nullable<string>;
};

export type FilteringCondition<T> = T extends number
  ? {
      $gt?: number;
      $gte?: number;
      $lt?: number;
      $lte?: number;
    }
  : T | (T extends string ? RegExp : never);
