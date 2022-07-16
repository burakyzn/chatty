import DrawerHeader from "./DrawerHeader";
import DrawerInput from "./DrawerInput";
import HoverableAvatar from "./HoverableAvatar";
import userService from "../services/userService";
import { default as CameraIcon } from "@mui/icons-material/CameraAlt";
import { useContext, useState, useRef } from "react";
import { MenuContext } from "../contexts/menuContext";
import { avatarSelector } from "../features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { changeAvatar } from "../features/userSlice";
import "../styles/Drawer.css";
import "../styles/SettingDrawer.css";

export default function SettingDrawer(props) {
  const { openSetting, setOpenSetting } = useContext(MenuContext);
  const avatar = useSelector(avatarSelector);
  const [about, setAbout] = useState("");
  const [nickname, setNickname] = useState("Burak");
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { width } = props;

  const onImageChange = async (event) => {
    await userService.uploadAvatar(event.target.files[0]).then((response) => {
      if (response.success) {
        alert(response.message);
        dispatch(changeAvatar(response.url));
      } else {
        console.log(response);
      }
    });
  };

  return (
    <div className="drawer" style={openSetting ? { width: width } : null}>
      <DrawerHeader text="Settings" back={() => setOpenSetting(false)} />
      <HoverableAvatar
        src={avatar}
        text={nickname}
        hover={
          <div className="setting__avatar-text">
            <CameraIcon />
            <div>Change Photo</div>
          </div>
        }
        hoverOnClick={() => fileInputRef.current.click()}
        className="setting__avatar"
      />
      <DrawerInput
        labelText="Nickname: "
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <DrawerInput
        labelText="About Me: "
        value={about}
        onChange={(e) => setAbout(e.target.value)}
      />
      <input
        type="file"
        onChange={onImageChange}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
    </div>
  );
}
