import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isActiveSearchBox: false,
  isActiveSettingPanel: false,
};

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
    toggleSettingPanel(state) {
      state.isActiveSettingPanel = !state.isActiveSettingPanel;
    },
  },
});

export const {
  openSearchBox,
  closeSearchBox,
  toggleSettingPanel,
} = todoSlice.actions;

export default todoSlice.reducer;
