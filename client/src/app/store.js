import {configureStore} from '@reduxjs/toolkit'
import sidebarReducer from '../features/sidebarSlice'
import chatReducer from '../features/chatSlice'

export const store = configureStore({
  reducer:{
    'sidebar': sidebarReducer,
    'chat': chatReducer
  }
})
