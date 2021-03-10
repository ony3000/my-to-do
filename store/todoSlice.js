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

export const launchApp = createAsyncThunk('todo/launchApp', async () => {
  const promise = new Promise((resolve) => {
    // API 호출로 데이터를 가져온다고 가정했을 때, 요청 완료되는 시간이 고정되어있지 않음을 나타냄
    const delay = 500 + Math.floor(Math.random() * 100);

    // 실제로는 localStorage에 저장된 데이터를 가져와서 resolve()에 전달할 예정
    setTimeout(() => {
      resolve({
        data: [],
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
    },
    closeSearchBox(state) {
      state.isActiveSearchBox = false;
    },
    openSidebar(state) {
      state.isActiveSidebar = true;
    },
    closeSidebar(state) {
      state.isActiveSidebar = false;
    },
    openSettingPanel(state) {
      state.isActiveSettingPanel = true;
    },
    closeSettingPanel(state) {
      state.isActiveSettingPanel = false;
    },
    turnOnSmartList(state, { payload }) {
      state.settings.smartList[payload] = true;
    },
    turnOffSmartList(state, { payload }) {
      state.settings.smartList[payload] = false;
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
    }
  },
  extraReducers: builder => {
    builder.addCase(launchApp.fulfilled, (state, { payload }) => {
      state.isAppReady = true;
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
} = todoSlice.actions;

export default todoSlice.reducer;
