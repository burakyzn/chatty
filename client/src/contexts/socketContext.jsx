import { io } from "socket.io-client";
import { createContext, useState } from "react";

export const SocketContext = createContext();

const socket =
  process.env.NODE_ENV === "production"
    ? io()
    : io(process.env.REACT_APP_API_BASE);

function SocketProvider(props) {
  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
