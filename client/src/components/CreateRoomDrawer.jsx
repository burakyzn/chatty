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
import { useContext, useState } from "react";
import { MenuContext } from "../contexts/menuContext";
import "../styles/Drawer.css";
import "../styles/CreateRoomDrawer.css";

export default function CreateRoomDrawer(props) {
  const { openCreateRoom, setOpenCreateRoom } = useContext(MenuContext);
  const [roomName, setRoomName] = useState("My Room");
  const { width } = props;

  const [checked, setChecked] = useState([1]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <div className="drawer" style={openCreateRoom ? { width: width } : null}>
      <DrawerHeader text="Rooms" back={() => setOpenCreateRoom(false)} />
      <DrawerInput
        labelText="Room Name: "
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <div className="create-room__search-box">
        <SearchBox />
      </div>
      <List dense className="create-room__users">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((value) => {
          const labelId = `checkbox-list-secondary-label-${value}`;
          return (
            <ListItem
              key={value}
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={handleToggle(value)}
                  checked={checked.indexOf(value) !== -1}
                  inputProps={{ "aria-labelledby": labelId }}
                />
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar text="Burak" />
                </ListItemAvatar>
                <ListItemText
                  id={labelId}
                  primary={<span style={{ marginLeft: "5px" }}>Test User</span>}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Button
        variant="contained"
        color="success"
        className="create-room__button"
      >
        Create
      </Button>
    </div>
  );
}
