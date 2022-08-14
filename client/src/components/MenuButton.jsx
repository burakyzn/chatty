import Popup from "reactjs-popup";
import { useContext } from "react";
import { MenuContext } from "../contexts/menuContext";
import { IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { resetChatState } from "../features/chatSlice";
import { resetSidebarState } from "../features/sidebarSlice";
import { useDispatch } from "react-redux";
import { SocketContext } from "../contexts/socketContext";
import "../styles/MenuButton.css";

export default function MenuButton() {
  const { setOpenSetting, setOpenCreateRoom } = useContext(MenuContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(resetChatState());
    dispatch(resetSidebarState());
    socket.close();
    navigate("/login");
  };

  return (
    <IconButton color="inherit" className="menu-button">
      <Popup
        trigger={<Menu className="menu-button__icon" />}
        position="right top"
        on="click"
        closeOnDocumentClick
        mouseLeaveDelay={300}
        mouseEnterDelay={0}
        arrow={false}
      >
        <div className="menu">
          <div className="menu__item" onClick={() => setOpenCreateRoom(true)}>
            Create Room
          </div>
          <div className="menu__item" onClick={() => setOpenSetting(true)}>
            Settings
          </div>
          <div className="menu__item" onClick={handleLogout}>
            Logout
          </div>
        </div>
      </Popup>
    </IconButton>
  );
}
