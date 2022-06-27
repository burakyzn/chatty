import { useEffect, useContext, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../contexts/socketContext";
import {
  messagesSelector,
  addMessage,
  nicknameSelector,
} from "../features/chatSlice";
import "../styles/ChatArea.css";

export default function ChatArea() {
  const messages = useSelector(messagesSelector);
  const nickname = useSelector(nicknameSelector);
  const dispatch = useDispatch();
  const chatAreaRef = useRef(null);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    socket.on("chat-message", (message) => {
      dispatch(addMessage(message));
    });

    return () => {
      socket.off("chat-message");
    };
  }, [socket, dispatch]);

  return (
    <div ref={chatAreaRef} className="chat-area">
      {messages.map(
        (message, index) =>
          message.visible && (
            <ChatMessage
              key={index}
              message={message.message}
              onRight={message.nickname === nickname}
              nickname={message.to == "Public" ? message.nickname : null}
            />
          )
      )}
    </div>
  );
}
