import React from "react";
import ReactDOM from "react-dom";
import SocketProvider from "./contexts/socketContext";
import Home from "./screen/Home";

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider>
      <Home />
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
