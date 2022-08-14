import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  onlineUsers : [],
  offlineUsers : [],
  myRooms: []
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    resetSidebarState : () => initialState,
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
    },
    addMyRooms: (state, action) => {
      state.myRooms = [...action.payload];
    }
  }
});

export const onlineUserSelector = (state) => state.sidebar.onlineUsers;
export const offlineUserSelector = (state) => state.sidebar.offlineUsers;
export const myRoomSelector = (state) => state.sidebar.myRooms;

export const {
  resetSidebarState, 
  addOnlineUsers, 
  addOfflineUsers, 
  filterUsers, 
  addMyRooms 
} = sidebarSlice.actions

export default sidebarSlice.reducer
