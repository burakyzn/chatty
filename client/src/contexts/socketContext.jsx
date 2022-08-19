import { io } from "socket.io-client";
import { useState, createContext, useEffect } from "react";

export const SocketContext = createContext();

function SocketProvider(props) {
  const [token, setToken] = useState("");

  const socketOptions = {
    autoConnect: false,
    auth: {
      token: token,
    },
  };

  const handleNewSocket = () =>
    process.env.NODE_ENV === "production"
      ? io(socketOptions)
      : io(process.env.REACT_APP_API_BASE, socketOptions);

  const [socket, setSocket] = useState(handleNewSocket);

  useEffect(() => {
    socketOptions.auth.token = token;
    setSocket(handleNewSocket);
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, setToken }}>
      {props.children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
