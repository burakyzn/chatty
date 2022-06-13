import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  onlineUsers : [],
  offlineUsers : []
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    addOnlineUsers: (state, action) => {
      state.onlineUsers = [...action.payload]
    },
    addOfflineUsers: (state, action) => {
      state.offlineUsers = [...action.payload]
    },
    filterUsers: (state, action) => {
      state.onlineUsers = state.onlineUsers.map(user => ({
        ...user,
        visible: user.nickname
          .toUpperCase()
          .includes(action.payload.toUpperCase()),
      }));

      state.offlineUsers = state.offlineUsers.map(user => ({
        ...user,
        visible: user.nickname
          .toUpperCase()
          .includes(action.payload.toUpperCase()),
      }));
    }
  }
});

export const onlineUserSelector = (state) => state.sidebar.onlineUsers;
export const offlineUserSelector = (state) => state.sidebar.offlineUsers;

export const {addOnlineUsers, addOfflineUsers, filterUsers} = sidebarSlice.actions
export default sidebarSlice.reducer
