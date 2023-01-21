import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import invariant from 'tiny-invariant';
import { v4 as uuid } from 'uuid';
import merge from 'lodash.merge';
import {
  Dict,
  ReactMouseEvent,
  OrderingCriterion,
  OrderingDirection,
  ThemeColor,
} from '@/lib/types/common';
import { isDict } from '@/lib/types/guard';
import { TodoItemBase, TodoItem, TodoAppState } from '@/lib/types/store/todoSlice';

export const CHANGE_THEME = 'CHANGE_THEME';
export const TOGGLE_COMPLETED_ITEMS = 'TOGGLE_COMPLETED_ITEMS';
export const IMPORTANCE = 'IMPORTANCE';
export const DEADLINE = 'DEADLINE';
export const MYDAY = 'MYDAY';
export const TITLE = 'TITLE';
export const CREATION_DATE = 'CREATION_DATE';
export const ASCENDING = 'ASCENDING';
export const DESCENDING = 'DESCENDING';

const initialState: TodoAppState = {
  isAppReady: false,
  isActiveSearchBox: false,
  isActiveSidebar: true,
  isActiveSettingPanel: false,
  settings: {
    general: {
      confirmBeforeRemoving: true,
      moveImportantTask: true,
    },
    smartList: {
      important: true,
      planned: true,
      all: true,
      completed: true,
      autoHideEmptyLists: false,
    },
  },
  todoItems: [],
  listOptionPosition: null,
  themePalettePosition: null,
  orderingCriterionPosition: null,
  deadlinePickerPosition: null,
  deadlineCalendarPosition: null,
  toolbarFunctions: {
    myday: {
      listOrdering: [IMPORTANCE, DEADLINE, TITLE, CREATION_DATE],
    },
    important: {
      listOption: [TOGGLE_COMPLETED_ITEMS],
    },
    planned: {
      listOption: [TOGGLE_COMPLETED_ITEMS],
    },
    all: {
      listOption: [CHANGE_THEME],
    },
    completed: {
      listOption: [CHANGE_THEME],
    },
    inbox: {
      listOption: [CHANGE_THEME],
      listOrdering: [IMPORTANCE, DEADLINE, MYDAY, TITLE, CREATION_DATE],
    },
    search: {
      listOption: [TOGGLE_COMPLETED_ITEMS],
    },
    'search/[keyword]': {
      listOption: [TOGGLE_COMPLETED_ITEMS],
    },
  },
  pageSettings: {
    myday: {
      ordering: null,
    },
    important: {
      isHideCompletedItems: false,
    },
    planned: {
      isHideCompletedItems: false,
    },
    all: {
      themeColor: 'blue',
    },
    completed: {
      themeColor: 'blue',
    },
    inbox: {
      themeColor: 'blue',
      ordering: null,
    },
    search: {
      isHideCompletedItems: false,
    },
    'search/[keyword]': {
      isHideCompletedItems: false,
    },
  },
  focusedTaskId: null,
};

const saveState = (state: TodoAppState) =>
  localStorage.setItem('cloneCoding:my-to-do', JSON.stringify(state));

const loadState = (): Dict => {
  const storedValue = localStorage.getItem('cloneCoding:my-to-do');
  let state = null;

  try {
    invariant(typeof storedValue === 'string');
    state = JSON.parse(storedValue);
    invariant(isDict(state)); // explicit throw for non-object
  } catch (err) {
    state = {};
  } finally {
    invariant(isDict(state)); // type narrowing
  }

  return state;
};

export const launchApp = createAsyncThunk('todo/launchApp', async () => {
  const promise = new Promise<{ data: TodoAppState & Dict }>(async (resolve) => {
    // API 호출로 데이터를 가져온다고 가정했을 때, 요청 완료되는 시간이 고정되어있지 않음을 나타냄
    const delay = 350 + Math.floor(Math.random() * 150);

    const combinedState: TodoAppState & Dict = merge({}, initialState, loadState(), {
      listOptionPosition: null,
      themePalettePosition: null,
      orderingCriterionPosition: null,
      deadlinePickerPosition: null,
      deadlineCalendarPosition: null,
      focusedTaskId: null,
    });

    setTimeout(() => {
      resolve({
        data: combinedState,
      });
    }, delay);
  });
  const response = await promise;

  return response.data;
});

export const openListOption = createAsyncThunk<
  { top: number; left: number },
  { event: ReactMouseEvent<HTMLButtonElement>; selector: string }
>('todo/openListOption', ({ event, selector }) => {
  const button = event.currentTarget.closest(selector);

  invariant(button, '요소를 찾을 수 없습니다.');

  const { top, left, width, height } = button.getBoundingClientRect();
  const optionWidth = 200;
  const optionPosition = {
    top: Math.floor(top + height - 2),
    left: Math.floor(left + width / 2 - optionWidth / 2),
  };

  return Promise.resolve(optionPosition);
});

export const openThemePalette = createAsyncThunk<
  { top: number; left: number },
  { event: ReactMouseEvent<HTMLButtonElement>; selector: string }
>('todo/openThemePalette', ({ event, selector }) => {
  const option = event.currentTarget.closest(selector);

  invariant(option, '요소를 찾을 수 없습니다.');

  const { top, left, width } = option.getBoundingClientRect();
  const paletteWidth = 282;
  const paletteHeight = 82;
  const palettePosition = {
    top: Math.floor(top),
    left: Math.floor(left + width - 1),
  };

  if (palettePosition.left + paletteWidth + 8 > window.innerWidth) {
    palettePosition.top = Math.floor(top - paletteHeight);
    palettePosition.left = Math.floor(left);
  }

  return Promise.resolve(palettePosition);
});

export const openOrderingCriterion = createAsyncThunk<
  { top: number; left: number } | { top: number; right: number },
  { event: ReactMouseEvent<HTMLButtonElement>; selector: string }
>('todo/openOrderingCriterion', ({ event, selector }) => {
  const button = event.currentTarget.closest(selector);

  invariant(button, '요소를 찾을 수 없습니다.');

  const { top, left, width, height } = button.getBoundingClientRect();
  const criterionWidth = 200;
  const topPosition = Math.floor(top + height - 2);
  const leftPosition = Math.floor(left + width / 2 - criterionWidth / 2);
  const criterionPosition =
    leftPosition + criterionWidth + 8 > window.innerWidth
      ? { top: topPosition, right: 8 }
      : { top: topPosition, left: leftPosition };

  return Promise.resolve(criterionPosition);
});

export const openDeadlinePicker = createAsyncThunk<
  { top: number; right: number },
  { event: ReactMouseEvent<HTMLButtonElement>; selector: string }
>('todo/openDeadlinePicker', ({ event, selector }) => {
  const button = event.currentTarget.closest(selector);

  invariant(button, '요소를 찾을 수 없습니다.');

  const section = button.parentElement;

  invariant(section, '요소를 찾을 수 없습니다.');

  const { top, left, height } = button.getBoundingClientRect();
  const pickerWidth = 200;
  const pickerHeight = 217;
  const pickerPosition = {
    top: Math.floor(top + height - 2),
    right: window.innerWidth - Math.floor(left + section.clientWidth / 2 + pickerWidth / 2),
  };

  if (pickerPosition.top + pickerHeight + 8 > window.innerHeight) {
    pickerPosition.top = Math.floor(top - pickerHeight + 2);
  }

  return Promise.resolve(pickerPosition);
});

export const openDeadlineCalendar = createAsyncThunk<
  { top: number; right: number },
  { event: ReactMouseEvent<HTMLButtonElement>; selector: string }
>('todo/openDeadlineCalendar', ({ event, selector }) => {
  const button = event.currentTarget.closest(selector);

  invariant(button, '요소를 찾을 수 없습니다.');

  const { top, left } = button.getBoundingClientRect();
  const calendarWidth = 220;
  const calendarHeight = 371;
  const calendarPosition = {
    top: Math.floor(top),
    right: window.innerWidth - Math.floor(left),
  };

  if (calendarPosition.top + calendarHeight + 8 > window.innerHeight) {
    calendarPosition.top = window.innerHeight - (calendarHeight + 8);
  }

  if (calendarPosition.right + calendarWidth + 8 > window.innerWidth) {
    calendarPosition.top = Math.floor(top - calendarHeight);
    calendarPosition.right = window.innerWidth - Math.floor(left + calendarWidth);
  }

  return Promise.resolve(calendarPosition);
});

/* eslint-disable no-param-reassign */
const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    openSearchBox(state) {
      state.isActiveSearchBox = true;
      saveState(state);
    },
    closeSearchBox(state) {
      state.isActiveSearchBox = false;
      saveState(state);
    },
    openSidebar(state) {
      state.isActiveSidebar = true;
      saveState(state);
    },
    closeSidebar(state) {
      state.isActiveSidebar = false;
      saveState(state);
    },
    closeListOption(state) {
      state.listOptionPosition = null;
      saveState(state);
    },
    closeThemePalette(state) {
      state.themePalettePosition = null;
      saveState(state);
    },
    closeOrderingCriterion(state) {
      state.orderingCriterionPosition = null;
      saveState(state);
    },
    closeDeadlinePicker(state) {
      state.deadlinePickerPosition = null;
      saveState(state);
    },
    closeDeadlineCalendar(state) {
      state.deadlineCalendarPosition = null;
      saveState(state);
    },
    openDetailPanel(state, { payload }: PayloadAction<string>) {
      state.focusedTaskId = payload;
      saveState(state);
    },
    closeDetailPanel(state) {
      state.focusedTaskId = null;
      saveState(state);
    },
    openSettingPanel(state) {
      state.isActiveSettingPanel = true;
      saveState(state);
    },
    closeSettingPanel(state) {
      state.isActiveSettingPanel = false;
      saveState(state);
    },
    turnOnGeneral(state, { payload }: PayloadAction<keyof TodoAppState['settings']['general']>) {
      state.settings.general[payload] = true;
      saveState(state);
    },
    turnOffGeneral(state, { payload }: PayloadAction<keyof TodoAppState['settings']['general']>) {
      state.settings.general[payload] = false;
      saveState(state);
    },
    turnOnSmartList(
      state,
      { payload }: PayloadAction<keyof TodoAppState['settings']['smartList']>,
    ) {
      state.settings.smartList[payload] = true;
      saveState(state);
    },
    turnOffSmartList(
      state,
      { payload }: PayloadAction<keyof TodoAppState['settings']['smartList']>,
    ) {
      state.settings.smartList[payload] = false;
      saveState(state);
    },
    createTodoItem(state, { payload }: PayloadAction<Partial<TodoItem>>) {
      const now = new Date();
      const newTask: TodoItem = Object.assign(
        {},
        {
          id: uuid(),
          title: '',
          isComplete: false,
          subSteps: [],
          isImportant: false,
          isMarkedAsTodayTask: false,
          deadline: null,
          memo: '',
          createdAt: now.getTime(),
          completedAt: null,
          markedAsImportantAt: null,
          markedAsTodayTaskAt: null,
        },
        payload,
      );

      if (newTask.isImportant) {
        newTask.markedAsImportantAt = now.getTime();
      }
      if (newTask.isMarkedAsTodayTask) {
        newTask.markedAsTodayTaskAt = now.getTime();
      }

      state.todoItems.push(newTask);
      saveState(state);
    },
    removeTodoItem(state, { payload }: PayloadAction<string>) {
      const targetTaskIndex = state.todoItems.findIndex(({ id }) => id === payload);

      state.todoItems.splice(targetTaskIndex, 1);
      saveState(state);
    },
    updateTodoItem(
      state,
      { payload }: PayloadAction<Pick<TodoItem, 'id'> & Partial<Omit<TodoItem, 'id'>>>,
    ) {
      const targetTaskIndex = state.todoItems.findIndex(({ id }) => id === payload.id);

      state.todoItems[targetTaskIndex] = Object.assign(
        {},
        state.todoItems[targetTaskIndex],
        payload,
      );
      saveState(state);
    },
    markAsCompleteWithOrderingFlag(state, { payload }: PayloadAction<string>) {
      const targetTask = state.todoItems.find(({ id }) => id === payload);

      invariant(targetTask, '작업을 찾을 수 없습니다.');
      targetTask.isComplete = true;
      targetTask.completedAt = new Date().getTime();
      saveState(state);
    },
    markAsIncomplete(state, { payload }: PayloadAction<string>) {
      const targetTask = state.todoItems.find(({ id }) => id === payload);

      invariant(targetTask, '작업을 찾을 수 없습니다.');
      targetTask.isComplete = false;
      saveState(state);
    },
    markAsImportant(state, { payload }: PayloadAction<string>) {
      const targetTask = state.todoItems.find(({ id }) => id === payload);

      invariant(targetTask, '작업을 찾을 수 없습니다.');
      targetTask.isImportant = true;
      saveState(state);
    },
    markAsImportantWithOrderingFlag(state, { payload }: PayloadAction<string>) {
      const targetTask = state.todoItems.find(({ id }) => id === payload);

      invariant(targetTask, '작업을 찾을 수 없습니다.');
      targetTask.isImportant = true;
      targetTask.markedAsImportantAt = new Date().getTime();
      saveState(state);
    },
    markAsUnimportant(state, { payload }: PayloadAction<string>) {
      const targetTask = state.todoItems.find(({ id }) => id === payload);

      invariant(targetTask, '작업을 찾을 수 없습니다.');
      targetTask.isImportant = false;
      saveState(state);
    },
    markAsTodayTaskWithOrderingFlag(state, { payload }: PayloadAction<string>) {
      const targetTask = state.todoItems.find(({ id }) => id === payload);

      invariant(targetTask, '작업을 찾을 수 없습니다.');
      targetTask.isMarkedAsTodayTask = true;
      targetTask.markedAsTodayTaskAt = new Date().getTime();
      saveState(state);
    },
    markAsNonTodayTask(state, { payload }: PayloadAction<string>) {
      const targetTask = state.todoItems.find(({ id }) => id === payload);

      invariant(targetTask, '작업을 찾을 수 없습니다.');
      targetTask.isMarkedAsTodayTask = false;
      saveState(state);
    },
    showCompletedItems(
      state,
      { payload }: PayloadAction<'important' | 'planned' | 'search' | 'search/[keyword]'>,
    ) {
      state.pageSettings[payload].isHideCompletedItems = false;
      saveState(state);
    },
    hideCompletedItems(
      state,
      { payload }: PayloadAction<'important' | 'planned' | 'search' | 'search/[keyword]'>,
    ) {
      state.pageSettings[payload].isHideCompletedItems = true;
      saveState(state);
    },
    setThemeColor(
      state,
      {
        payload: { pageKey, color },
      }: PayloadAction<{ pageKey: 'all' | 'completed' | 'inbox'; color: ThemeColor }>,
    ) {
      state.pageSettings[pageKey].themeColor = color;
      saveState(state);
    },
    setOrderingCriterion(
      state,
      {
        payload: { pageKey, criterion, direction },
      }: PayloadAction<{
        pageKey: 'myday' | 'inbox';
        criterion: OrderingCriterion;
        direction: OrderingDirection;
      }>,
    ) {
      state.pageSettings[pageKey].ordering = {
        criterion,
        direction,
      };
      saveState(state);
    },
    reverseOrderingCriterion(
      state,
      { payload: { pageKey } }: PayloadAction<{ pageKey: 'myday' | 'inbox' }>,
    ) {
      const ordering = state.pageSettings[pageKey].ordering;

      invariant(ordering, '정렬 기준이 없습니다.');

      const oldDirection = ordering.direction;

      ordering.direction = oldDirection === ASCENDING ? DESCENDING : ASCENDING;
      saveState(state);
    },
    unsetOrderingCriterion(
      state,
      { payload: { pageKey } }: PayloadAction<{ pageKey: 'myday' | 'inbox' }>,
    ) {
      state.pageSettings[pageKey].ordering = null;
      saveState(state);
    },
    createSubStep(
      state,
      { payload: { taskId, title } }: PayloadAction<{ taskId: string; title: string }>,
    ) {
      const targetTask = state.todoItems.find(({ id }) => id === taskId);

      invariant(targetTask, '작업을 찾을 수 없습니다.');
      targetTask.subSteps.push({
        id: uuid(),
        title,
        isComplete: false,
        createdAt: new Date().getTime(),
      });
      saveState(state);
    },
    removeSubStep(
      state,
      { payload: { taskId, stepId } }: PayloadAction<{ taskId: string; stepId: string }>,
    ) {
      const targetTask = state.todoItems.find(({ id }) => id === taskId);

      invariant(targetTask, '작업을 찾을 수 없습니다.');

      const targetStepIndex = targetTask.subSteps.findIndex(({ id }) => id === stepId);

      targetTask.subSteps.splice(targetStepIndex, 1);
      saveState(state);
    },
    updateSubStep(
      state,
      {
        payload: { taskId, stepId, ...others },
      }: PayloadAction<
        { taskId: string; stepId: string } & Partial<Omit<TodoItemBase, 'id' | 'createdAt'>>
      >,
    ) {
      const targetTask = state.todoItems.find(({ id }) => id === taskId);

      invariant(targetTask, '작업을 찾을 수 없습니다.');

      const targetStepIndex = targetTask.subSteps.findIndex(({ id }) => id === stepId);

      targetTask.subSteps[targetStepIndex] = Object.assign(
        {},
        targetTask.subSteps[targetStepIndex],
        others,
      );
      saveState(state);
    },
    setDeadline(
      state,
      { payload: { taskId, deadline } }: PayloadAction<{ taskId: string; deadline: number }>,
    ) {
      const targetTask = state.todoItems.find(({ id }) => id === taskId);

      invariant(targetTask, '작업을 찾을 수 없습니다.');
      targetTask.deadline = deadline;
      saveState(state);
    },
    unsetDeadline(state, { payload }: PayloadAction<string>) {
      const targetTask = state.todoItems.find(({ id }) => id === payload);

      invariant(targetTask, '작업을 찾을 수 없습니다.');
      targetTask.deadline = null;
      saveState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      launchApp.fulfilled,
      (state, { payload }: PayloadAction<TodoAppState & Dict>) => {
        invariant(isDict(state));
        Object.keys(state).forEach((key) => {
          (state as Dict)[key] = payload[key];
        });
        state.isAppReady = true;
        saveState(state);
      },
    );
    builder.addCase(
      openListOption.fulfilled,
      (state, { payload }: PayloadAction<TodoAppState['listOptionPosition']>) => {
        state.listOptionPosition = payload;
        saveState(state);
      },
    );
    builder.addCase(
      openThemePalette.fulfilled,
      (state, { payload }: PayloadAction<TodoAppState['themePalettePosition']>) => {
        state.themePalettePosition = payload;
        saveState(state);
      },
    );
    builder.addCase(
      openOrderingCriterion.fulfilled,
      (state, { payload }: PayloadAction<TodoAppState['orderingCriterionPosition']>) => {
        state.orderingCriterionPosition = payload;
        saveState(state);
      },
    );
    builder.addCase(
      openDeadlinePicker.fulfilled,
      (state, { payload }: PayloadAction<TodoAppState['deadlinePickerPosition']>) => {
        state.deadlinePickerPosition = payload;
        saveState(state);
      },
    );
    builder.addCase(
      openDeadlineCalendar.fulfilled,
      (state, { payload }: PayloadAction<TodoAppState['deadlineCalendarPosition']>) => {
        state.deadlineCalendarPosition = payload;
        saveState(state);
      },
    );
  },
});
/* eslint-enable no-param-reassign */

export const {
  openSearchBox,
  closeSearchBox,
  openSidebar,
  closeSidebar,
  closeListOption,
  closeThemePalette,
  closeOrderingCriterion,
  closeDeadlinePicker,
  closeDeadlineCalendar,
  openDetailPanel,
  closeDetailPanel,
  openSettingPanel,
  closeSettingPanel,
  turnOnGeneral,
  turnOffGeneral,
  turnOnSmartList,
  turnOffSmartList,
  createTodoItem,
  removeTodoItem,
  updateTodoItem,
  markAsCompleteWithOrderingFlag,
  markAsIncomplete,
  markAsImportant,
  markAsImportantWithOrderingFlag,
  markAsUnimportant,
  markAsTodayTaskWithOrderingFlag,
  markAsNonTodayTask,
  showCompletedItems,
  hideCompletedItems,
  setThemeColor,
  setOrderingCriterion,
  reverseOrderingCriterion,
  unsetOrderingCriterion,
  createSubStep,
  removeSubStep,
  updateSubStep,
  setDeadline,
  unsetDeadline,
} = todoSlice.actions;

export default todoSlice.reducer;
