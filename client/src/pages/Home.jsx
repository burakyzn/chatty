import SidebarHeader from "../components/SidebarHeader";
import ChatList from "../components/ChatList";
import ChatHeader from "../components/ChatHeader";
import ChatInputBox from "../components/ChatInputBox";
import ChatArea from "../components/ChatArea";
import CreateRoomDrawer from "../components/CreateRoomDrawer";
import Loader from "../components/Loader";
import authService from "../services/authService";
import SettingDrawer from "../components/SettingDrawer";
import MenuProvider from "../contexts/menuContext";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../contexts/socketContext";
import { useNavigate } from "react-router-dom";
import { fetchPublicMessages } from "../features/chatSlice";
import { useDispatch } from "react-redux";
import { changeNickname } from "../features/chatSlice";
import "../styles/Home.css";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const [loader, setLoader] = useState(false);
  const [settingDrawerWidth, setSettingDrawerWidth] = useState("0");
  const sidebarRef = useRef();

  useEffect(() => {
    dispatch(fetchPublicMessages());
  }, [dispatch]);

  useEffect(() => {
    setSettingDrawerWidth(sidebarRef.current.clientWidth + "px");
  }, []);

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
      <div ref={sidebarRef} className="home__sidebar">
        <MenuProvider>
          <SidebarHeader />
          <CreateRoomDrawer width={settingDrawerWidth} />
          <SettingDrawer width={settingDrawerWidth} />
        </MenuProvider>
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
