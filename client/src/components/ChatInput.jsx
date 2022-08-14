import { useContext } from "react";
import { MessageContext } from "../contexts/messageContext";
import "../styles/ChatInput.css";

export default function ChatInput() {
  const { message, setMessage, sendMessage } = useContext(MessageContext);

  const handleSetMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
      event.preventDefault();
    }
  };

  return (
    <input
      className="chat-input"
      type="text"
      name="chat-message"
      id="chat-message"
      placeholder="Message"
      value={message}
      onChange={(e) => handleSetMessage(e)}
      onKeyDown={handleKeyPress}
    />
  );
}
