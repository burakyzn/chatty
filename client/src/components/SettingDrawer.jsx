import DrawerHeader from "./DrawerHeader";
import { useContext } from "react";
import { MenuContext } from "../contexts/menuContext";
import "../styles/Drawer.css";

export default function SettingDrawer(props) {
  const { openSetting, setOpenSetting } = useContext(MenuContext);
  const { width } = props;

  return (
    <div class="drawer" style={openSetting ? { width: width } : null}>
      <DrawerHeader text="Settings" back={() => setOpenSetting(false)} />
    </div>
  );
}
