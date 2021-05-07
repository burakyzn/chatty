import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainScreen from './screen/main';
import {io} from 'socket.io-client';

const socket = io("http://localhost:5000"); // http://localhost:5000

ReactDOM.render(
  <React.StrictMode>
    <MainScreen></MainScreen>
  </React.StrictMode>,
  document.getElementById('root')
);

export {socket};