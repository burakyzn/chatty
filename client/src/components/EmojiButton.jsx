import { IconButton } from "@mui/material";
import { default as EmojiIcon } from "@mui/icons-material/InsertEmoticon";
import "../styles/EmojiButton.css";

export default function EmojiButton() {
  return (
    <IconButton
      color="inherit"
      onClick={() => {
        alert("open emoji menu!");
      }}
      className="emoji-button"
    >
      <EmojiIcon />
    </IconButton>
  );
}
