import ChatCard from "./ChatCard";
import { useEffect, useContext } from "react";
import { SocketContext } from "../contexts/socketContext";
import { ButtonBase } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addOfflineUsers,
  addOnlineUsers,
  onlineUserSelector,
  offlineUserSelector,
} from "../features/sidebarSlice";
import {
  changeSelectedAvatar,
  changeSelectedChat,
  nicknameSelector,
  selectedChatSelector,
} from "../features/chatSlice";
import "../styles/ChatList.css";

export default function ChatList() {
  const onlineUsers = useSelector(onlineUserSelector);
  const offlineUsers = useSelector(offlineUserSelector);
  const myNickname = useSelector(nicknameSelector);
  const selectedChat = useSelector(selectedChatSelector);
  const dispatch = useDispatch();
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on("online-users", (userList) => {
      let users = userList.map((user) => ({ ...user, visible: true }));
      dispatch(addOnlineUsers(users));
    });

    return () => {
      socket.off("online-users");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on("offline-users", (userList) => {
      let users = userList.map((user) => ({ ...user, visible: true }));
      dispatch(addOfflineUsers(users));
    });

    return () => {
      socket.off("offline-users");
    };
  }, [socket, dispatch]);

  const handleChangeSelectedChat = (chatName, avatar) => {
    dispatch(changeSelectedChat(chatName));
    dispatch(changeSelectedAvatar(avatar));
  };

  return (
    <div className="chat-list">
      <ButtonBase
        className="chat-list__card"
        onClick={() => handleChangeSelectedChat("Public")}
      >
        <ChatCard
          text="Public"
          hiddenCircle
          selected={selectedChat === "Public"}
        />
      </ButtonBase>
      {onlineUsers.map(
        (onlineUser) =>
          onlineUser.visible &&
          onlineUser.nickname !== myNickname && (
            <ButtonBase
              key={onlineUser.socketID}
              className="chat-list__card"
              onClick={() =>
                handleChangeSelectedChat(
                  onlineUser.nickname,
                  "https://randomuser.me/api/portraits/men/22.jpg"
                )
              }
            >
              <ChatCard
                text={onlineUser.nickname}
                selected={selectedChat === onlineUser.nickname}
                avatarSrc="https://randomuser.me/api/portraits/men/22.jpg"
                online
              />
            </ButtonBase>
          )
      )}
      {offlineUsers.map(
        (offlineUser, index) =>
          offlineUser.visible && (
            <ButtonBase
              key={index}
              className="chat-list__card"
              onClick={() =>
                handleChangeSelectedChat(
                  offlineUser.nickname,
                  offlineUser.avatar
                )
              }
            >
              <ChatCard
                text={offlineUser.nickname}
                selected={selectedChat === offlineUser.nickname}
                avatarSrc={offlineUser.avatar}
              />
            </ButtonBase>
          )
      )}
    </div>
  );
}
