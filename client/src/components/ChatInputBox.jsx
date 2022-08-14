import EmojiButton from "./EmojiButton";
import SendButton from "./SendButton";
import ChatInput from "./ChatInput";
import MessageProvider from "../contexts/messageContext";
import "../styles/ChatInputBox.css";

export default function ChatInputBox() {
  return (
    <div className="chat-input-box">
      <MessageProvider>
        <EmojiButton />
        <ChatInput />
        <SendButton />
      </MessageProvider>
    </div>
  );
}
