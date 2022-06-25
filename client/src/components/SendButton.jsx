import { IconButton } from "@mui/material";
import { default as SendIcon } from "@mui/icons-material/Send";
import { useContext } from "react";
import { MessageContext } from "../contexts/messageContext";
import "../styles/SendButton.css";

export default function SendButton() {
  const { sendMessage } = useContext(MessageContext);

  return (
    <IconButton color="inherit" onClick={sendMessage} className="send-button">
      <SendIcon />
    </IconButton>
  );
}
