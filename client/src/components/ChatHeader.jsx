import Avatar from "./Avatar";
import MoreButton from "./MoreButton";
import "../styles/ChatHeader.css";

export default function ChatHeader() {
  return (
    <div className="chat-header">
      <Avatar
        src="https://randomuser.me/api/portraits/men/7.jpg"
        className="chat-header__avatar"
      />
      <span className="chat-header__text">Burak Yazan</span>
      <MoreButton />
    </div>
  );
}
