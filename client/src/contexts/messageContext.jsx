import { createContext, useState, useContext, useEffect } from "react";
import { SocketContext } from "./socketContext";
import { useSelector } from "react-redux";
import { selectedChatSelector } from "../features/chatSlice";
import { useNavigate } from "react-router-dom";

export const MessageContext = createContext();

function MessageProvider(props) {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const chat = useSelector(selectedChatSelector);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("chat-message-error", (error) => {
      console.error(error);
      navigate("/login");
    });

    return () => {
      socket.off("chat-message-error");
    };
  }, [socket, navigate]);

  const sendMessage = () => {
    socket.emit("chat-message", {
      to: chat,
      message: message,
      token: localStorage.getItem("token"),
    });

    setMessage("");
  };

  return (
    <MessageContext.Provider value={{ message, setMessage, sendMessage }}>
      {props.children}
    </MessageContext.Provider>
  );
}

export default MessageProvider;
