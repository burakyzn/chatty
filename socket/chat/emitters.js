module.exports = (io, socket) => {
  const chatMessageError = () => {
    socket.emit("chat-message-error", "unauthorized-token");
  }

  const chatMessage = (nickname, message, to) => {
    io.emit("chat-message", {nickname: nickname, message: message, to:to});
  }

  return {
    chatMessage,
    chatMessageError
  }
}