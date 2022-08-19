import DrawerHeader from "./DrawerHeader";
import DrawerInput from "./DrawerInput";
import HoverableAvatar from "./HoverableAvatar";
import userService from "../services/userService";
import DrawerSelect from "../components/DrawerSelect";
import { LanguageContext } from "../contexts/languageContext";
import { default as CameraIcon } from "@mui/icons-material/CameraAlt";
import { useContext, useState, useRef } from "react";
import { MenuContext } from "../contexts/menuContext";
import { avatarSelector } from "../features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { changeAvatar, aboutMeSelector } from "../features/userSlice";
import { nicknameSelector } from "../features/chatSlice";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import MenuItem from "@mui/material/MenuItem";
import "../styles/Drawer.css";
import "../styles/SettingDrawer.css";

export default function SettingDrawer(props) {
  const { width } = props;
  const dispatch = useDispatch();

  const avatar = useSelector(avatarSelector);
  const nickname = useSelector(nicknameSelector);
  const currentAboutMe = useSelector(aboutMeSelector);
  const { openSetting, setOpenSetting } = useContext(MenuContext);
  const { language, setLanguage } = useContext(LanguageContext);

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

  const onLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="drawer" style={openSetting ? { width: width } : null}>
      <DrawerHeader
        text={<FormattedMessage id="settings" />}
        back={() => setOpenSetting(false)}
      />
      <HoverableAvatar
        src={avatar}
        text={nickname}
        hover={
          <div className="setting__avatar-text">
            <CameraIcon />
            <div>
              <FormattedMessage id="changePhoto" />
            </div>
          </div>
        }
        hoverOnClick={() => fileInputRef.current.click()}
        className="setting__avatar"
      />
      <DrawerInput
        labelText={<FormattedMessage id="nickname" />}
        value={nickname}
      />
      <DrawerInput
        labelText={<FormattedMessage id="aboutMe" />}
        value={aboutMe}
        onChange={(e) => setAboutMe(e.target.value)}
        onSave={onSaveAboutMe}
        editable
      />
      <DrawerSelect
        label={<FormattedMessage id="language" />}
        value={language}
        onChange={onLanguageChange}
      >
        <MenuItem value={"tr"}>
          <FormattedMessage id="turkish" />
        </MenuItem>
        <MenuItem value={"en"}>
          <FormattedMessage id="english" />
        </MenuItem>
      </DrawerSelect>
      <input
        type="file"
        onChange={onImageChange}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
    </div>
  );
}
