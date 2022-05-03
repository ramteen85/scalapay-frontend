import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: initialState,
  reducers: {
    toggleSidebar(state, action) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar(state, action) {
      state.sidebarOpen = false;
    },
  },
});

// actions
export const sidebarActions = sidebarSlice.actions;

// default
export default sidebarSlice.reducer;
