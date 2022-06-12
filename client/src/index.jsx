import React from "react";
import ReactDOM from "react-dom";
import Home from "./screen/Home";

import { io } from "socket.io-client";
const socket =
  process.env.NODE_ENV === "production"
    ? io()
    : io(process.env.REACT_APP_API_BASE);

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById("root")
);

export { socket };
