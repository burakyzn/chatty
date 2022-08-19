import { useContext } from "react";
import { MessageContext } from "../contexts/messageContext";
import { FormattedMessage } from "react-intl";
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
    <FormattedMessage id="message">
      {(formattedMessage) => (
        <input
          className="chat-input"
          type="text"
          name="chat-message"
          id="chat-message"
          placeholder={formattedMessage}
          value={message}
          onChange={(e) => handleSetMessage(e)}
          onKeyDown={handleKeyPress}
        />
      )}
    </FormattedMessage>
  );
}
