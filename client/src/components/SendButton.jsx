import { IconButton } from "@mui/material";
import { default as SendIcon } from "@mui/icons-material/Send";
import "../styles/SendButton.css";

export default function SendButton() {
  return (
    <IconButton
      color="inherit"
      onClick={() => {
        alert("send message");
      }}
      className="send-button"
    >
      <SendIcon />
    </IconButton>
  );
}
