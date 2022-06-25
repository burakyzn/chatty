import { useContext } from "react";
import Popup from "reactjs-popup";
import Picker from "emoji-picker-react";
import { default as EmojiIcon } from "@mui/icons-material/InsertEmoticon";
import { MessageContext } from "../contexts/messageContext";
import "../styles/EmojiButton.css";

export default function EmojiButton() {
  const { setMessage } = useContext(MessageContext);

  const onEmojiClick = (event, emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  return (
    <Popup
      trigger={<EmojiIcon className="emoji-button" />}
      position="top center"
      on="click"
    >
      <Picker
        onEmojiClick={onEmojiClick}
        disableSkinTonePicker
        disableSearchBar
      />
    </Popup>
  );
}
