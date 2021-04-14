import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import dayjs from '@/plugins/dayjs';

export const CHANGE_THEME = 'CHANGE_THEME';
export const TOGGLE_COMPLETED_ITEMS = 'TOGGLE_COMPLETED_ITEMS';

const initialState = {
  isAppReady: false,
  isActiveSearchBox: false,
  isActiveSidebar: true,
  isActiveListOption: false,
  isActiveSettingPanel: false,
  settings: {
    smartList: {
      important: true,
      planned: true,
      all: false,
      completed: false,
      autoHideEmptyLists: false,
    },
  },
  todoItems: [],
  listOptionPosition: {},
  toolbarFunctions: {
    myday: {
      listOption: null,
      listOrdering: [],
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
      listOrdering: [],
    },
  },
  pageSettings: {
    myday: {
      ordering: [],
    },
    important: {
      isHideCompletedItems: false,
    },
    planned: {
      isHideCompletedItems: false,
    },
    all: {
      themeColor: null,
    },
    completed: {
      themeColor: null,
    },
    inbox: {
      themeColor: null,
      ordering: [],
    },
  },
};

const saveState = (state) => localStorage.setItem('cloneCoding:my-to-do', JSON.stringify(state));

const loadState = () => JSON.parse(localStorage.getItem('cloneCoding:my-to-do')) || {};

export const launchApp = createAsyncThunk('todo/launchApp', async () => {
  const promise = new Promise(async (resolve) => {
    // API 호출로 데이터를 가져온다고 가정했을 때, 요청 완료되는 시간이 고정되어있지 않음을 나타냄
    const delay = 500 + Math.floor(Math.random() * 100);

    const combinedState = Object.assign({}, initialState, loadState());

    if (combinedState.todoItems.length === 0) {
      const getRandomInt = (min, max) => (min + Math.floor(Math.random() * (max + 1)));

      const response = await fetch('https://jsonplaceholder.typicode.com/users/1/todos');
      const dummyItems = await response.json();

      const now = dayjs();
      const midnightToday = now.startOf('day');

      combinedState.todoItems = dummyItems.map(({ id, title, completed }) => ({
        id: uuid(),
        title,
        isComplete: completed,
        subSteps: Array(getRandomInt(0, 3)).fill(null).map(() => ({
          title: 'test',
          isComplete: Boolean(getRandomInt(0, 1)),
        })),
        isImportant: Boolean(getRandomInt(0, 1)),
        isMarkedAsTodayTask: Boolean(getRandomInt(0, 1)),
        deadline: Boolean(getRandomInt(0, 1)) ? Number(midnightToday.add(getRandomInt(-3, 7), 'day').format('x')) - 1 : null,
        memo: Boolean(getRandomInt(0, 1)) ? 'this is a memo' : '',
        createdAt: Number(now.format('x')) - (20 - id) * 1000,
      }));
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
  const optionPosition = {
    top: Math.floor(top + height - 2),
    left: Math.floor(left + width / 2 - 100),
  };

  return Promise.resolve(optionPosition);
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
    openSettingPanel(state) {
      state.isActiveSettingPanel = true;
      saveState(state);
    },
    closeSettingPanel(state) {
      state.isActiveSettingPanel = false;
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
      state.todoItems.push(Object.assign({}, {
        id: uuid(),
        title: '',
        isComplete: false,
        subSteps: [],
        isImportant: false,
        isMarkedAsTodayTask: false,
        deadline: null,
        memo: '',
        createdAt: new Date().getTime(),
      }, payload));
      saveState(state);
    },
    markAsComplete(state, { payload }) {
      state.todoItems.find(({ id }) => (id === payload)).isComplete = true;
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
    markAsUnimportant(state, { payload }) {
      state.todoItems.find(({ id }) => (id === payload)).isImportant = false;
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
  },
});

export const {
  openSearchBox,
  closeSearchBox,
  openSidebar,
  closeSidebar,
  closeListOption,
  openSettingPanel,
  closeSettingPanel,
  turnOnSmartList,
  turnOffSmartList,
  createTodoItem,
  markAsComplete,
  markAsIncomplete,
  markAsImportant,
  markAsUnimportant,
  showCompletedItems,
  hideCompletedItems,
} = todoSlice.actions;

export default todoSlice.reducer;
