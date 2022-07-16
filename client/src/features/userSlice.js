import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  avatar: null,
  nickname: "",
  aboutme: ""
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeAvatar : (state,action) => {
      state.avatar = action.payload
    },
  }
});

export const avatarSelector = (state) => state.user.avatar;
export const {changeAvatar} = userSlice.actions
export default userSlice.reducer