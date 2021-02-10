import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isActiveSearchBox: false,
  isActiveSidebar: true,
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
});

export const {
  openSearchBox,
  closeSearchBox,
  openSidebar,
  closeSidebar,
  toggleSettingPanel,
} = todoSlice.actions;

export default todoSlice.reducer;
