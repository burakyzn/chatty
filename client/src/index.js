import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainScreen from './screen/main';
import { io } from 'socket.io-client';
const socket =
  process.env.NODE_ENV === 'production'
    ? io()
    : io(process.env.REACT_APP_API_BASE);

ReactDOM.render(
  <React.StrictMode>
    <MainScreen></MainScreen>
  </React.StrictMode>,
  document.getElementById('root')
);

export { socket };
