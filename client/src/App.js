import './App.css';
import MainScreen from './App/MainScreen.js'
import {io} from 'socket.io-client';

const socket = io(); // http://localhost:5000

function App() {
  return (
    <MainScreen></MainScreen>
  );
}

export {socket};
export default App;
