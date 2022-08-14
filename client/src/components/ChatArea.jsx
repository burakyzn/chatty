import ChatMessage from "./ChatMessage";
import { useEffect, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../contexts/socketContext";
import {
  messagesSelector,
  addMessage,
  nicknameSelector,
} from "../features/chatSlice";
import { myRoomSelector } from "../features/sidebarSlice";
import "../styles/ChatArea.css";

export default function ChatArea() {
  const dispatch = useDispatch();
  const messages = useSelector(messagesSelector);
  const nickname = useSelector(nicknameSelector);
  const myRooms = useSelector(myRoomSelector);

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
              onCenter={message.nickname === "System"}
              onRight={message.nickname === nickname}
              nickname={
                message.nickname !== "System" &&
                (message.to === "Public" || myRooms.includes(message.to))
                  ? message.nickname
                  : null
              }
            />
          )
      )}
    </div>
  );
}
