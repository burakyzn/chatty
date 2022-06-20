import { useContext, useEffect } from "react";
import SidebarHeader from "../components/SidebarHeader";
import ChatList from "../components/ChatList";
import ChatHeader from "../components/ChatHeader";
import ChatInputBox from "../components/ChatInputBox";
import ChatArea from "../components/ChatArea";
import { SocketContext } from "../contexts/socketContext";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on("new-user-error", (error) => {
      console.error(error);
      navigate("/login");
    });

    return () => {
      socket.off("new-user-error");
    };
  }, [socket]);

  useEffect(() => {
    let token = localStorage.getItem("token");

    if (token) socket.emit("new-user", token);
    else navigate("/login");
  }, [socket]);

  return (
    <div className="home">
      <div className="home__sidebar">
        <SidebarHeader />
        <ChatList />
      </div>
      <div className="home__chat">
        <ChatHeader />
        <ChatArea />
        <ChatInputBox />
      </div>
    </div>
  );
}

export default Home;
