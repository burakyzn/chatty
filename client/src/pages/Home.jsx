import { useContext, useEffect, useState } from "react";
import SidebarHeader from "../components/SidebarHeader";
import ChatList from "../components/ChatList";
import ChatHeader from "../components/ChatHeader";
import ChatInputBox from "../components/ChatInputBox";
import ChatArea from "../components/ChatArea";
import { SocketContext } from "../contexts/socketContext";
import { useNavigate } from "react-router-dom";
import { fetchPublicMessages } from "../features/chatSlice";
import { useDispatch } from "react-redux";
import authService from "../services/authService";
import Loader from "../components/Loader";
import { changeNickname } from "../features/chatSlice";
import "../styles/Home.css";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    dispatch(fetchPublicMessages());
  }, [dispatch]);

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

    if (token) {
      setLoader(true);
      authService
        .nickname()
        .then((result) => {
          dispatch(changeNickname(result.nickname));
          socket.emit("new-user", token);
          setLoader(false);
        })
        .catch((error) => {
          console.error(error.code, error.message);
          navigate("/login");
        });
    } else navigate("/login");
  }, [socket]);

  return loader ? (
    <Loader open={loader} />
  ) : (
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
