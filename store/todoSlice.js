import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  isAppReady: false,
  isActiveSearchBox: false,
  isActiveSidebar: true,
  isActiveSettingPanel: false,
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
    toggleSettingPanel(state) {
      state.isActiveSettingPanel = !state.isActiveSettingPanel;
    },
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
  toggleSettingPanel,
} = todoSlice.actions;

export default todoSlice.reducer;