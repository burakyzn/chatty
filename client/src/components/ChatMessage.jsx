import "../styles/ChatMessage.css";

export default function ChatMessage(props) {
  const { message, onCenter, onRight, nickname } = props;

  return (
    <div
      className={`chat-message
      ${onCenter ? "center" : ""} 
      ${onRight ? "right" : ""}`}
    >
      {nickname && !onRight && (
        <div className="chat-message__nickname">{nickname}</div>
      )}
      <div>{message}</div>
    </div>
  );
}
