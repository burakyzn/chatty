import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  nickname: "",
  selectedChat: 'Public',
  selectedAvatar: null,
  messages: []
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    changeSelectedChat : (state,action) => {
      state.selectedChat = action.payload;
      state.messages = state.messages.map(message => ({
        ...message,
        visible: (message.to === state.nickname && message.nickname === action.payload) 
        || (message.nickname === state.nickname && message.to === action.payload) 
        || (action.payload === "Public" && message.to === "Public")
      }))
    },
    changeSelectedAvatar : (state,action) => {
      state.selectedAvatar = action.payload;
    },
    addMessage: (state, action) => {
      state.messages = [...state.messages, {
        ...action.payload,
        visible: (action.payload.to === state.nickname && action.payload.nickname === state.selectedChat)
        || (action.payload.nickname === state.nickname && action.payload.to === state.selectedChat) 
        || (action.payload.to === "Public" && state.selectedChat === "Public")
      }];
    },
    changeNickname: (state,action) => {
      state.nickname = action.payload;
    }
  }
});

export const selectedChatSelector = (state) => state.chat.selectedChat;
export const selectedAvatarSelector = (state) => state.chat.selectedAvatar;
export const messagesSelector = (state) => state.chat.messages;
export const nicknameSelector = (state) => state.chat.nickname;

export const {changeSelectedChat, changeSelectedAvatar, addMessage, changeNickname } = chatSlice.actions
export default chatSlice.reducer