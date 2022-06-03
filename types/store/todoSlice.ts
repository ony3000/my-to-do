import {
  Nullable,
  ListOption,
  OrderingCriterion,
  OrderingDirection,
  ThemeColor,
} from '@/types/common';

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
  orderingCriterionPosition: Nullable<{
    top: number;
    left: number;
  } | {
    top: number;
    right: number;
  }>;
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
      listOrdering: OrderingCriterion[];
    };
    important: {
      listOption: ListOption[];
    };
    planned: {
      listOption: ListOption[];
    };
    all: {
      listOption: ListOption[];
    };
    completed: {
      listOption: ListOption[];
    };
    inbox: {
      listOption: ListOption[];
      listOrdering: OrderingCriterion[];
    };
    search: {
      listOption: ListOption[];
    };
    'search/[keyword]': {
      listOption: ListOption[];
    };
  };
  pageSettings: {
    myday: {
      ordering: Nullable<{
        criterion: OrderingCriterion;
        direction: OrderingDirection;
      }>;
    };
    important: {
      isHideCompletedItems: boolean;
    };
    planned: {
      isHideCompletedItems: boolean;
    };
    all: {
      themeColor: ThemeColor;
    };
    completed: {
      themeColor: ThemeColor;
    };
    inbox: {
      themeColor: ThemeColor;
      ordering: Nullable<{
        criterion: OrderingCriterion;
        direction: OrderingDirection;
      }>;
    };
    search: Nullable<{
      isHideCompletedItems: boolean;
    }>;
    'search/[keyword]': Nullable<{
      isHideCompletedItems: boolean;
    }>;
  };
  focusedTaskId: Nullable<string>;
};
