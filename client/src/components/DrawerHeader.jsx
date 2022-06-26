import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import "../styles/DrawerHeader.css";

export default function DrawerHeader(props) {
  const { back, text } = props;

  return (
    <div class="drawer-header">
      <IconButton color="inherit" className="drawer-header__button">
        <ArrowBack onClick={back} className="drawer-header__button-icon" />
      </IconButton>
      <div className="drawer-header__text">{text}</div>
    </div>
  );
}
