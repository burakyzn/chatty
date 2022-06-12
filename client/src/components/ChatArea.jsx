import ChatMessage from "./ChatMessage";
import "../styles/ChatArea.css";

export default function ChatArea() {
  return (
    <div className="chat-area">
      <ChatMessage message="Hi! How are you?" />
      <ChatMessage message="Hi, I'm doing good. How about you?" onRight />
      <ChatMessage message="I'm fine thank you 😄" onRight />
    </div>
  );
}
