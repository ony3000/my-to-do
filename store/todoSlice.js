import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import merge from 'lodash.merge';
import dayjs from '@/plugins/dayjs';

export const CHANGE_THEME = 'CHANGE_THEME';
export const TOGGLE_COMPLETED_ITEMS = 'TOGGLE_COMPLETED_ITEMS';
export const IMPORTANCE = 'IMPORTANCE';
export const DEADLINE = 'DEADLINE';
export const MYDAY = 'MYDAY';
export const TITLE = 'TITLE';
export const CREATION_DATE = 'CREATION_DATE';
export const ASCENDING = 'ASCENDING';
export const DESCENDING = 'DESCENDING';

const initialState = {
  isAppReady: false,
  isActiveSearchBox: false,
  isActiveSidebar: true,
  isActiveListOption: false,
  isActiveThemePalette: false,
  isActiveOrderingCriterion: false,
  isActiveDeadlinePicker: false,
  isActiveDeadlineCalendar: false,
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
  listOptionPosition: {},
  themePalettePosition: {},
  orderingCriterionPosition: {},
  deadlinePickerPosition: {},
  deadlineCalendarPosition: {},
  toolbarFunctions: {
    myday: {
      listOption: null,
      listOrdering: [
        IMPORTANCE,
        DEADLINE,
        TITLE,
        CREATION_DATE,
      ],
    },
    important: {
      listOption: [TOGGLE_COMPLETED_ITEMS],
      listOrdering: null,
    },
    planned: {
      listOption: [TOGGLE_COMPLETED_ITEMS],
      listOrdering: null,
    },
    all: {
      listOption: [CHANGE_THEME],
      listOrdering: null,
    },
    completed: {
      listOption: [CHANGE_THEME],
      listOrdering: null,
    },
    inbox: {
      listOption: [CHANGE_THEME],
      listOrdering: [
        IMPORTANCE,
        DEADLINE,
        MYDAY,
        TITLE,
        CREATION_DATE,
      ],
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
  },
  focusedTaskId: null,
};

const saveState = (state) => localStorage.setItem('cloneCoding:my-to-do', JSON.stringify(state));

const loadState = () => JSON.parse(localStorage.getItem('cloneCoding:my-to-do')) || {};

export const launchApp = createAsyncThunk('todo/launchApp', async () => {
  const promise = new Promise(async (resolve) => {
    // API 호출로 데이터를 가져온다고 가정했을 때, 요청 완료되는 시간이 고정되어있지 않음을 나타냄
    const delay = 500 + Math.floor(Math.random() * 100);

    const combinedState = merge({}, initialState, loadState(), {
      isActiveListOption: false,
      isActiveThemePalette: false,
      isActiveOrderingCriterion: false,
      isActiveDeadlinePicker: false,
      isActiveDeadlineCalendar: false,
      listOptionPosition: {},
      themePalettePosition: {},
      orderingCriterionPosition: {},
      deadlinePickerPosition: {},
      deadlineCalendarPosition: {},
      focusedTaskId: null,
    });

    if (combinedState.todoItems.length === 0) {
      const getRandomInt = (min, max) => (min + Math.floor(Math.random() * (max + 1)));

      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const dummyItems = await response.json();

      const now = dayjs();
      const midnightToday = now.startOf('day');

      combinedState.todoItems = dummyItems.slice(0, 20).map(({ id, title, completed }, itemIndex) => {
        const createdAt = Number(now.format('x')) - (20 - id) * 1000;

        return {
          id: uuid(),
          title,
          isComplete: completed,
          subSteps: Array(getRandomInt(0, 3)).fill(null).map((_, stepIndex) => ({
            id: uuid(),
            title: dummyItems[itemIndex * 10 + stepIndex].title,
            isComplete: dummyItems[itemIndex * 10 + stepIndex].completed,
            createdAt: createdAt + (stepIndex + 1) * 1000,
          })),
          isImportant: Boolean(getRandomInt(0, 1)),
          isMarkedAsTodayTask: Boolean(getRandomInt(0, 1)),
          deadline: (
            Boolean(getRandomInt(0, 1))
              ? Number(midnightToday.add(getRandomInt(-3, 7), 'day').format('x')) - 1
              : null
          ),
          memo: Boolean(getRandomInt(0, 1)) ? dummyItems[itemIndex * 10 + 5].title : '',
          createdAt,
          completedAt: completed ? createdAt : null,
          markedAsImportantAt: createdAt,
          markedAsTodayTaskAt: createdAt,
        };
      });
    }

    setTimeout(() => {
      resolve({
        data: combinedState,
      });
    }, delay);
  });
  const response = await promise;

  return response.data;
});

export const openListOption = createAsyncThunk('todo/openListOption', ({ event, selector }) => {
  const button = event.target.closest(selector);
  const { top, left, width, height } = button.getBoundingClientRect();

  const optionWidth = 200;
  const optionPosition = {
    top: Math.floor(top + height - 2),
    left: Math.floor(left + width / 2 - optionWidth / 2),
  };

  return Promise.resolve(optionPosition);
});

export const openThemePalette = createAsyncThunk('todo/openThemePalette', ({ event, selector }) => {
  const option = event.target.closest(selector);
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

export const openOrderingCriterion = createAsyncThunk('todo/openOrderingCriterion', ({ event, selector }) => {
  const button = event.target.closest(selector);
  const { top, left, width, height } = button.getBoundingClientRect();

  const criterionWidth = 200;
  const criterionPosition = {
    top: Math.floor(top + height - 2),
    left: Math.floor(left + width / 2 - criterionWidth / 2),
  };

  if (criterionPosition.left + criterionWidth + 8 > window.innerWidth) {
    delete criterionPosition.left;
    criterionPosition.right = 8;
  }

  return Promise.resolve(criterionPosition);
});

export const openDeadlinePicker = createAsyncThunk('todo/openDeadlinePicker', ({ event, selector }) => {
  const button = event.target.closest(selector);
  const section = button.parentElement;
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

export const openDeadlineCalendar = createAsyncThunk('todo/openDeadlineCalendar', ({ event, selector }) => {
  const button = event.target.closest(selector);
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
      state.listOptionPosition = {};
      state.isActiveListOption = false;
      saveState(state);
    },
    closeThemePalette(state) {
      state.themePalettePosition = {};
      state.isActiveThemePalette = false;
      saveState(state);
    },
    closeOrderingCriterion(state) {
      state.orderingCriterionPosition = {};
      state.isActiveOrderingCriterion = false;
      saveState(state);
    },
    closeDeadlinePicker(state) {
      state.deadlinePickerPosition = {};
      state.isActiveDeadlinePicker = false;
      saveState(state);
    },
    closeDeadlineCalendar(state) {
      state.deadlineCalendarPosition = {};
      state.isActiveDeadlineCalendar = false;
      saveState(state);
    },
    openDetailPanel(state, { payload }) {
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
    turnOnGeneral(state, { payload }) {
      state.settings.general[payload] = true;
      saveState(state);
    },
    turnOffGeneral(state, { payload }) {
      state.settings.general[payload] = false;
      saveState(state);
    },
    turnOnSmartList(state, { payload }) {
      state.settings.smartList[payload] = true;
      saveState(state);
    },
    turnOffSmartList(state, { payload }) {
      state.settings.smartList[payload] = false;
      saveState(state);
    },
    createTodoItem(state, { payload }) {
      const now = new Date();
      const newTask = Object.assign({}, {
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
      }, payload);

      if (newTask.isImportant) {
        newTask.markedAsImportantAt = now.getTime();
      }
      if (newTask.isMarkedAsTodayTask) {
        newTask.markedAsTodayTaskAt = now.getTime();
      }

      state.todoItems.push(newTask);
      saveState(state);
    },
    removeTodoItem(state, { payload }) {
      const targetTaskIndex = state.todoItems.findIndex(({ id }) => (id === payload));

      state.todoItems.splice(targetTaskIndex, 1);
      saveState(state);
    },
    updateTodoItem(state, { payload }) {
      const targetTaskIndex = state.todoItems.findIndex(({ id }) => (id === payload.id));

      state.todoItems[targetTaskIndex] = Object.assign({}, state.todoItems[targetTaskIndex], payload);
      saveState(state);
    },
    markAsCompleteWithOrderingFlag(state, { payload }) {
      const targetTask = state.todoItems.find(({ id }) => (id === payload));

      targetTask.isComplete = true;
      targetTask.completedAt = new Date().getTime();
      saveState(state);
    },
    markAsIncomplete(state, { payload }) {
      state.todoItems.find(({ id }) => (id === payload)).isComplete = false;
      saveState(state);
    },
    markAsImportant(state, { payload }) {
      state.todoItems.find(({ id }) => (id === payload)).isImportant = true;
      saveState(state);
    },
    markAsImportantWithOrderingFlag(state, { payload }) {
      const targetTask = state.todoItems.find(({ id }) => (id === payload));

      targetTask.isImportant = true;
      targetTask.markedAsImportantAt = new Date().getTime();
      saveState(state);
    },
    markAsUnimportant(state, { payload }) {
      state.todoItems.find(({ id }) => (id === payload)).isImportant = false;
      saveState(state);
    },
    markAsTodayTaskWithOrderingFlag(state, { payload }) {
      const targetTask = state.todoItems.find(({ id }) => (id === payload));

      targetTask.isMarkedAsTodayTask = true;
      targetTask.markedAsTodayTaskAt = new Date().getTime();
      saveState(state);
    },
    markAsNonTodayTask(state, { payload }) {
      state.todoItems.find(({ id }) => (id === payload)).isMarkedAsTodayTask = false;
      saveState(state);
    },
    showCompletedItems(state, { payload }) {
      state.pageSettings[payload].isHideCompletedItems = false;
      saveState(state);
    },
    hideCompletedItems(state, { payload }) {
      state.pageSettings[payload].isHideCompletedItems = true;
      saveState(state);
    },
    setThemeColor(state, { payload: { pageKey, color } }) {
      state.pageSettings[pageKey].themeColor = color;
      saveState(state);
    },
    setOrderingCriterion(state, { payload: { pageKey, criterion, direction } }) {
      state.pageSettings[pageKey].ordering = {
        criterion,
        direction,
      };
      saveState(state);
    },
    reverseOrderingCriterion(state, { payload: { pageKey } }) {
      const oldDirection = state.pageSettings[pageKey].ordering.direction;

      state.pageSettings[pageKey].ordering.direction = oldDirection === ASCENDING ? DESCENDING : ASCENDING;
      saveState(state);
    },
    unsetOrderingCriterion(state, { payload: { pageKey } }) {
      state.pageSettings[pageKey].ordering = null;
      saveState(state);
    },
    createSubStep(state, { payload: { taskId, title } }) {
      state.todoItems.find(({ id }) => (id === taskId)).subSteps.push({
        id: uuid(),
        title,
        isComplete: false,
        createdAt: new Date().getTime(),
      });
      saveState(state);
    },
    removeSubStep(state, { payload: { taskId, stepId } }) {
      const targetTask = state.todoItems.find(({ id }) => (id === taskId));
      const targetStepIndex = targetTask.subSteps.findIndex(({ id }) => (id === stepId));

      targetTask.subSteps.splice(targetStepIndex, 1);
      saveState(state);
    },
    updateSubStep(state, { payload: { taskId, stepId, ...others } }) {
      const targetTask = state.todoItems.find(({ id }) => (id === taskId));
      const targetStepIndex = targetTask.subSteps.findIndex(({ id }) => (id === stepId));

      targetTask.subSteps[targetStepIndex] = Object.assign({}, targetTask.subSteps[targetStepIndex], others);
      saveState(state);
    },
    setDeadline(state, { payload: { taskId, deadline } }) {
      state.todoItems.find(({ id }) => (id === taskId)).deadline = deadline;
      saveState(state);
    },
    unsetDeadline(state, { payload }) {
      state.todoItems.find(({ id }) => (id === payload)).deadline = null;
      saveState(state);
    },
  },
  extraReducers: builder => {
    builder.addCase(launchApp.fulfilled, (state, { payload }) => {
      Object.keys(state).forEach((key) => {
        state[key] = payload[key];
      });
      state.isAppReady = true;
      saveState(state);
    });
    builder.addCase(openListOption.fulfilled, (state, { payload }) => {
      state.listOptionPosition = payload;
      state.isActiveListOption = true;
      saveState(state);
    });
    builder.addCase(openThemePalette.fulfilled, (state, { payload }) => {
      state.themePalettePosition = payload;
      state.isActiveThemePalette = true;
      saveState(state);
    });
    builder.addCase(openOrderingCriterion.fulfilled, (state, { payload }) => {
      state.orderingCriterionPosition = payload;
      state.isActiveOrderingCriterion = true;
      saveState(state);
    });
    builder.addCase(openDeadlinePicker.fulfilled, (state, { payload }) => {
      state.deadlinePickerPosition = payload;
      state.isActiveDeadlinePicker = true;
      saveState(state);
    });
    builder.addCase(openDeadlineCalendar.fulfilled, (state, { payload }) => {
      state.deadlineCalendarPosition = payload;
      state.isActiveDeadlineCalendar = true;
      saveState(state);
    });
  },
});

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
