import logo from './logo.svg';
import './App.css';
import {io} from 'socket.io-client';

const socket = io(); // htttp://localhost:5000

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Socket baglanti kontrol!</h1>
      </header>
    </div>
  );
}

export default App;
