import DrawerHeader from "./DrawerHeader";
import DrawerInput from "./DrawerInput";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "./Avatar";
import SearchBox from "./SearchBox";
import Button from "@mui/material/Button";
import { SocketContext } from "../contexts/socketContext";
import { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MenuContext } from "../contexts/menuContext";
import { nicknameSelector } from "../features/chatSlice";
import {
  onlineUserSelector,
  offlineUserSelector,
} from "../features/sidebarSlice";
import { FormattedMessage } from "react-intl";
import { toast } from "react-toastify";
import "../styles/Drawer.css";
import "../styles/CreateRoomDrawer.css";

export default function CreateRoomDrawer(props) {
  const myNickname = useSelector(nicknameSelector);
  const onlineUsers = useSelector(onlineUserSelector);
  const offlineUsers = useSelector(offlineUserSelector);
  const { socket } = useContext(SocketContext);

  const { openCreateRoom, setOpenCreateRoom } = useContext(MenuContext);
  const { width } = props;

  const [roomName, setRoomName] = useState("");
  const [checkedUsers, setCheckedUsers] = useState([]);

  useEffect(() => {
    socket.on("create-room-error", (message) => {
      toast.error(message);
    });

    return () => {
      socket.off("create-room-error");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("create-room-success", (message) => {
      toast.success(message);
    });

    return () => {
      socket.off("create-room-success");
    };
  }, [socket]);

  const AvailableUsers = () => {
    return [...onlineUsers, ...offlineUsers].map((user) => {
      return (
        user.visible &&
        user.nickname !== myNickname && (
          <ListItem
            key={user.nickname}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={handleToggle(user.nickname)}
                checked={checkedUsers.includes(user.nickname)}
                inputProps={{ "aria-labelledby": user.nickname }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar src={user.avatar} text={user.nickname} />
              </ListItemAvatar>
              <ListItemText
                id={user.nickname}
                primary={
                  <span className="create-room__nickname">{user.nickname}</span>
                }
              />
            </ListItemButton>
          </ListItem>
        )
      );
    });
  };

  const handleCreateButton = () => {
    let newRoom = {
      name: roomName,
      nicknames: checkedUsers,
    };
    socket.emit("create-room", newRoom);
    setOpenCreateRoom(false);
    setCheckedUsers([]);
  };

  const handleToggle = (value) => () => {
    const newChecked = [...checkedUsers];

    if (!checkedUsers.includes(value)) {
      newChecked.push(value);
    } else {
      newChecked.splice(checkedUsers.indexOf(value), 1);
    }

    setCheckedUsers(newChecked);
  };

  const randomDefaultRoomName = (message) => {
    let randomNumber = Math.floor(Math.random() * 10001);
    let defaultRoomName = message + randomNumber;

    return (
      <DrawerInput
        labelText={<FormattedMessage id="room" />}
        value={roomName ? roomName : defaultRoomName}
        onChange={(e) => setRoomName(e.target.value)}
        editable
      />
    );
  };

  return (
    <div className="drawer" style={openCreateRoom ? { width: width } : null}>
      <DrawerHeader
        text={<FormattedMessage id="rooms" />}
        back={() => setOpenCreateRoom(false)}
      />
      <FormattedMessage id="defaultRoom">
        {(message) => randomDefaultRoomName(message)}
      </FormattedMessage>
      <div className="create-room__search-box">
        <SearchBox />
      </div>
      <List className="create-room__users">
        <AvailableUsers />
      </List>
      <Button
        variant="contained"
        color="success"
        className="create-room__button"
        onClick={handleCreateButton}
      >
        <FormattedMessage id="create" />
      </Button>
    </div>
  );
}
