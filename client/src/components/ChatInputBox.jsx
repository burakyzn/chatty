import EmojiButton from "./EmojiButton";
import SendButton from "./SendButton";
import ChatInput from "./ChatInput";
import "../styles/ChatInputBox.css";

export default function ChatInputBox() {
  return (
    <div className="chat-input-box">
      <EmojiButton />
      <ChatInput />
      <SendButton />
    </div>
  );
}
