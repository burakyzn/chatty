import ChatCard from "./ChatCard";
import "../styles/ChatList.css";

export default function ChatList() {
  return (
    <div className="chat-list">
      <ChatCard />
      <ChatCard />
    </div>
  );
}
