import { IconButton } from "@mui/material";
import { default as MoreIcon } from "@mui/icons-material/MoreVert";
import "../styles/MoreButton.css";

export default function MoreButton() {
  return (
    <IconButton
      color="inherit"
      onClick={() => {
        alert("open more menu!");
      }}
      className="more-button"
    >
      <MoreIcon className="more-button__icon" />
    </IconButton>
  );
}
