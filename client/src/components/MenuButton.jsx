import { IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import "../styles/MenuButton.css";

export default function MenuButton() {
  return (
    <IconButton
      color="inherit"
      onClick={() => {
        alert("open menu!");
      }}
      className="menu-button"
    >
      <Menu className="menu-button__icon" />
    </IconButton>
  );
}
