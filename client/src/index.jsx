import React from "react";
import ReactDOM from "react-dom";
import SocketProvider from "./contexts/socketContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="chat" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
