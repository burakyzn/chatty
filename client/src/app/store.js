import {configureStore} from '@reduxjs/toolkit'
import sidebarReducer from '../features/sidebarSlice'
import chatReducer from '../features/chatSlice'
import userReducer from '../features/userSlice'

export const store = configureStore({
  reducer:{
    'sidebar': sidebarReducer,
    'chat': chatReducer,
    'user': userReducer
  }
})
