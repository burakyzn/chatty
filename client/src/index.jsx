import React from "react";
import ReactDOM from "react-dom";
import SocketProvider from "./contexts/socketContext";
import Home from "./screen/Home";
import { Provider } from "react-redux";
import { store } from "./app/store";

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider>
      <Provider store={store}>
        <Home />
      </Provider>
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
