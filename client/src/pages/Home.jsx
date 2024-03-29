import SidebarHeader from "../components/SidebarHeader";
import ChatList from "../components/ChatList";
import ChatHeader from "../components/ChatHeader";
import ChatInputBox from "../components/ChatInputBox";
import ChatArea from "../components/ChatArea";
import CreateRoomDrawer from "../components/CreateRoomDrawer";
import Loader from "../components/Loader";
import SettingDrawer from "../components/SettingDrawer";
import MenuProvider from "../contexts/menuContext";
import userService from "../services/userService";
import { SocketContext } from "../contexts/socketContext";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPublicMessages } from "../features/chatSlice";
import { useDispatch } from "react-redux";
import { changeNickname } from "../features/chatSlice";
import { changeAvatar, changeAboutMe } from "../features/userSlice";
import { toast } from "react-toastify";
import "../styles/Home.css";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket, setToken } = useContext(SocketContext);
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
      toast.error(error);
      navigate("/login");
    });

    return () => {
      socket.off("new-user-error");
    };
  }, [socket, navigate]);

  useEffect(() => {
    let token = localStorage.getItem("token");

    if (token) {
      setLoader(true);
      userService
        .userDetails()
        .then((result) => {
          dispatch(changeNickname(result.nickname));
          dispatch(changeAvatar(result.avatar));
          dispatch(changeAboutMe(result.aboutMe));
          setToken(token);
          socket.connect();
          socket.emit("new-user");
          setLoader(false);
        })
        .catch((error) => {
          toast.error(error.message);
          navigate("/login");
        });
    } else navigate("/login");
  }, [socket, navigate, dispatch]);

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
