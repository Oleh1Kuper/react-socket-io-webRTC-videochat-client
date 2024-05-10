import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  activeUsers: [],
  groupCallRooms: [],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.username = action.payload;
    },
    setActiveUser: (state, action) => {
      state.activeUsers = action.payload;
    },
    setGroupRooms: (state, action) => {
      state.groupCallRooms = action.payload;
    },
  },
});

export default dashboardSlice.reducer;

export const { actions } = dashboardSlice;
