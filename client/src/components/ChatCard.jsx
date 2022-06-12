import { default as CircleIcon } from "@mui/icons-material/Circle";
import Avatar from "../components/Avatar";
import "../styles/ChatCard.css";

export default function ChatCard() {
  return (
    <div className="chat-card">
      <div className="chat-card__avatar">
        <Avatar src="https://randomuser.me/api/portraits/men/16.jpg" />
      </div>
      <div className="chat-card__text">Burak Yazan</div>
      <CircleIcon className="chat-card__circle green" />
    </div>
  );
}
