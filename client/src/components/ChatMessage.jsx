import "../styles/ChatMessage.css";

export default function ChatMessage(props) {
  const { message, onRight } = props;

  return (
    <div className={`chat-message ${onRight ? "right" : ""}`}>{message}</div>
  );
}
