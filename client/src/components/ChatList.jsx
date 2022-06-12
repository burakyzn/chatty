import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../contexts/socketContext";
import { Avatar } from "@mui/material";
import ChatCard from "./ChatCard";
import "../styles/ChatList.css";

export default function ChatList() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on("online-users", (data) => {
      setOnlineUsers(data.userList);
    });

    return () => {
      socket.off("online-users");
    };
  }, []);

  useEffect(() => {
    socket.on("offline-users", (data) => {
      setOfflineUsers(data.userList);
    });

    return () => {
      socket.off("offline-users");
    };
  }, []);

  return (
    <div className="chat-list">
      <ChatCard text="Public" hiddenCircle />
      {onlineUsers.map((onlineUser) => (
        <ChatCard
          key={onlineUser.socketID}
          text={onlineUser.nickname}
          avatarSrc="https://randomuser.me/api/portraits/men/22.jpg"
          online
        />
      ))}
      {offlineUsers.map((offlineUser, index) => (
        <ChatCard
          key={index}
          text={offlineUser.nickname}
          avatarSrc={offlineUser.avatarURL}
        />
      ))}
    </div>
  );
}
