import Avatar from "../components/Avatar";
import { default as CircleIcon } from "@mui/icons-material/Circle";
import "../styles/ChatCard.css";

export default function ChatCard(props) {
  const { text, avatarSrc, hiddenCircle, online, selected } = props;
  return (
    <div className={`chat-card ${selected ? "selected" : ""}`}>
      <div className="chat-card__avatar">
        <Avatar src={avatarSrc} text={text} />
      </div>
      <div className="chat-card__text">{text}</div>
      {!hiddenCircle && (
        <CircleIcon
          className={`chat-card__circle ${online ? "green" : "grey"}`}
        />
      )}
    </div>
  );
}
