import DrawerHeader from "./DrawerHeader";
import DrawerInput from "./DrawerInput";
import HoverableAvatar from "./HoverableAvatar";
import userService from "../services/userService";
import { default as CameraIcon } from "@mui/icons-material/CameraAlt";
import { useContext, useState, useRef } from "react";
import { MenuContext } from "../contexts/menuContext";
import { avatarSelector } from "../features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { changeAvatar, aboutMeSelector } from "../features/userSlice";
import { nicknameSelector } from "../features/chatSlice";
import { toast } from "react-toastify";
import "../styles/Drawer.css";
import "../styles/SettingDrawer.css";

export default function SettingDrawer(props) {
  const { width } = props;
  const dispatch = useDispatch();

  const avatar = useSelector(avatarSelector);
  const nickname = useSelector(nicknameSelector);
  const currentAboutMe = useSelector(aboutMeSelector);
  const { openSetting, setOpenSetting } = useContext(MenuContext);

  const [aboutMe, setAboutMe] = useState(currentAboutMe);
  const fileInputRef = useRef(null);

  const onImageChange = async (event) => {
    await userService.updateAvatar(event.target.files[0]).then((response) => {
      if (response.success) {
        toast.success(response.message);
        dispatch(changeAvatar(response.url));
      } else {
        toast.error(response.message);
      }
    });
  };

  const onSaveAboutMe = async () => {
    if (currentAboutMe === aboutMe) return;

    await userService.updateAboutMe(aboutMe).then((response) => {
      if (response.success) toast.success(response.message);
      else toast.error(response.message);
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
      <DrawerInput labelText="Nickname: " value={nickname} />
      <DrawerInput
        labelText="About Me: "
        value={aboutMe}
        onChange={(e) => setAboutMe(e.target.value)}
        onSave={onSaveAboutMe}
        editable
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
