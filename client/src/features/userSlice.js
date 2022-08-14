import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  avatar: null,
  aboutMe: ""
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeAvatar : (state,action) => {
      state.avatar = action.payload
    },
    changeAboutMe : (state, action) => {
      state.aboutMe = action.payload
    }
  }
});

export const avatarSelector = (state) => state.user.avatar;
export const aboutMeSelector = (state) => state.user.aboutMe;
export const {changeAvatar, changeAboutMe} = userSlice.actions
export default userSlice.reducer