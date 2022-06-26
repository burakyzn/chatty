import Picker from "emoji-picker-react";
import Popup from "reactjs-popup";
import { useContext } from "react";
import { default as EmojiIcon } from "@mui/icons-material/InsertEmoticon";
import { MessageContext } from "../contexts/messageContext";
import { IconButton } from "@mui/material";
import "../styles/EmojiButton.css";

export default function EmojiButton() {
  const { setMessage } = useContext(MessageContext);

  const onEmojiClick = (event, emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  return (
    <IconButton color="inherit" className="emoji-button">
      <Popup trigger={<EmojiIcon />} position="top center" on="click">
        <Picker
          onEmojiClick={onEmojiClick}
          disableSkinTonePicker
          disableSearchBar
        />
      </Popup>
    </IconButton>
  );
}
