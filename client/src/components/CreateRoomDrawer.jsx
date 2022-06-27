import DrawerHeader from "./DrawerHeader";
import { useContext } from "react";
import { MenuContext } from "../contexts/menuContext";
import "../styles/Drawer.css";

export default function CreateRoomDrawer(props) {
  const { openCreateRoom, setOpenCreateRoom } = useContext(MenuContext);
  const { width } = props;

  return (
    <div className="drawer" style={openCreateRoom ? { width: width } : null}>
      <DrawerHeader text="Rooms" back={() => setOpenCreateRoom(false)} />
    </div>
  );
}
