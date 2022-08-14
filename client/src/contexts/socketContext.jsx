import { io } from "socket.io-client";
import { createContext } from "react";

export const SocketContext = createContext();

const socket =
  process.env.NODE_ENV === "production"
    ? io({
        autoConnect: false,
      })
    : io(process.env.REACT_APP_API_BASE, {
        autoConnect: false,
      });

function SocketProvider(props) {
  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
