import Popup from "reactjs-popup";
import { default as MoreIcon } from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import { SocketContext } from "../contexts/socketContext";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { selectedChatSelector } from "../features/chatSlice";
import "../styles/MoreButton.css";

export default function MoreButton() {
  const selectedChat = useSelector(selectedChatSelector);
  const { socket } = useContext(SocketContext);

  const handleLeaveRoom = () => {
    let roomContent = {
      room: selectedChat,
      token: localStorage.getItem("token"),
    };
    socket.emit("leave-room", roomContent);

    // TODO : change selected chat
  };

  return (
    <IconButton color="inherit" className="more-button">
      <Popup
        trigger={<MoreIcon className="more-button__icon" />}
        position="left top"
        on="click"
        closeOnDocumentClick
        mouseLeaveDelay={300}
        mouseEnterDelay={0}
        arrow={false}
      >
        <div className="menu">
          <div className="menu__item" onClick={handleLeaveRoom}>
            Leave Room
          </div>
        </div>
      </Popup>
    </IconButton>
  );
}
