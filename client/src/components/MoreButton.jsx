import Popup from "reactjs-popup";
import { default as MoreIcon } from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import { SocketContext } from "../contexts/socketContext";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedChatSelector,
  changeSelectedChat,
} from "../features/chatSlice";
import { myRoomSelector } from "../features/sidebarSlice";

import "../styles/MoreButton.css";
import { FormattedMessage } from "react-intl";

export default function MoreButton() {
  const dispatch = useDispatch();
  const { socket } = useContext(SocketContext);

  const selectedChat = useSelector(selectedChatSelector);
  const myRooms = useSelector(myRoomSelector);

  const handleLeaveRoom = () => {
    let roomContent = {
      room: selectedChat,
    };
    socket.emit("leave-room", roomContent);
    dispatch(changeSelectedChat("Public"));
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
          <div className="menu__item">
            <FormattedMessage id="details" />
          </div>
          {myRooms.includes(selectedChat) && (
            <div className="menu__item" onClick={handleLeaveRoom}>
              <FormattedMessage id="leaveRoom" />
            </div>
          )}
        </div>
      </Popup>
    </IconButton>
  );
}
