import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';

const initialState = {
  isAppReady: false,
  isActiveSearchBox: false,
  isActiveSidebar: true,
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
};

const saveState = (state) => localStorage.setItem('cloneCoding:my-to-do', JSON.stringify(state));

const loadState = () => JSON.parse(localStorage.getItem('cloneCoding:my-to-do')) || {};

export const launchApp = createAsyncThunk('todo/launchApp', async () => {
  const promise = new Promise((resolve) => {
    // API 호출로 데이터를 가져온다고 가정했을 때, 요청 완료되는 시간이 고정되어있지 않음을 나타냄
    const delay = 500 + Math.floor(Math.random() * 100);

    // 실제로는 localStorage에 저장된 데이터를 가져와서 resolve()에 전달할 예정
    setTimeout(() => {
      resolve({
        data: Object.assign({}, initialState, loadState()),
      });
    }, delay);
  });
  const response = await promise;

  return response.data;
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
  },
  extraReducers: builder => {
    builder.addCase(launchApp.fulfilled, (state, { payload }) => {
      Object.keys(state).forEach((key) => {
        state[key] = payload[key];
      });
      state.isAppReady = true;
      saveState(state);
    });
  },
});

export const {
  openSearchBox,
  closeSearchBox,
  openSidebar,
  closeSidebar,
  openSettingPanel,
  closeSettingPanel,
  turnOnSmartList,
  turnOffSmartList,
  createTodoItem,
  markAsComplete,
  markAsIncomplete,
  markAsImportant,
  markAsUnimportant,
} = todoSlice.actions;

export default todoSlice.reducer;
