import Avatar from "./Avatar";
import MoreButton from "./MoreButton";
import { useSelector } from "react-redux";
import {
  selectedChatSelector,
  selectedAvatarSelector,
} from "../features/chatSlice";
import "../styles/ChatHeader.css";

export default function ChatHeader() {
  const selectedChat = useSelector(selectedChatSelector);
  const selectedAvatar = useSelector(selectedAvatarSelector);

  return (
    <div className="chat-header">
      <Avatar
        src={selectedAvatar}
        className="chat-header__avatar"
        text={selectedChat}
      />
      <span className="chat-header__text">{selectedChat}</span>
      <MoreButton />
    </div>
  );
}
