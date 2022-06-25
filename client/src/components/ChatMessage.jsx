import "../styles/ChatMessage.css";

export default function ChatMessage(props) {
  const { message, onRight, nickname } = props;

  return (
    <div className={`chat-message ${onRight ? "right" : ""}`}>
      {nickname && !onRight && (
        <div className="chat-message__nickname">{nickname}</div>
      )}
      <div>{message}</div>
    </div>
  );
}
