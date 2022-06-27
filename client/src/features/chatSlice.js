import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../services/chatService';

const initialState = {
  nickname: "",
  selectedChat: 'Public',
  selectedAvatar: null,
  messages: [],
  fetchedMessages : []
}

export const fetchPublicMessages = createAsyncThunk(
  'chat/publicMessages',
  async () => await chatService.getPublicMessages()
)

export const fetchPrivateMessages = createAsyncThunk(
  'chat/privateMessages',
  async (nickname, { getState }) => {
    const state = getState();

    if(state.chat.fetchedMessages.includes(nickname))
      return {
        process: false
      };
    
    let messages = await chatService.getPrivateMessages(nickname).then(response => response.messages);
    return {
      process: true,
      nickname: nickname,
      messages: messages
    };
  }
)

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicMessages.fulfilled, (state, action) => {
        state.messages = [...action.payload.messages.map(message => ({
          ...message,
          visible: true
        }))];
      })
      .addCase(fetchPrivateMessages.fulfilled, (state, action) => {
        if(action.payload.process){
          state.messages = state.messages.filter(message => message.nickname !== action.payload.nickname);

          state.messages = [...state.messages, ...action.payload.messages.map(message => ({
            ...message,
            visible: true
          }))];

          state.fetchedMessages = [...state.fetchedMessages, action.payload.nickname];
        }
      })
  },
});

export const selectedChatSelector = (state) => state.chat.selectedChat;
export const selectedAvatarSelector = (state) => state.chat.selectedAvatar;
export const messagesSelector = (state) => state.chat.messages;
export const nicknameSelector = (state) => state.chat.nickname;

export const {changeSelectedChat, changeSelectedAvatar, addMessage, changeNickname } = chatSlice.actions
export default chatSlice.reducer