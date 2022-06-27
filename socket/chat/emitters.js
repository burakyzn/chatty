const userService = require('../../services/userService');

module.exports = (io, socket) => {
  const chatMessageError = () => {
    socket.emit("chat-message-error", "unauthorized-token");
  }

  const chatMessage = (nickname, message, to, date) => {
    if(to === "Public"){
      io.emit("chat-message", {nickname: nickname, message: message, to:to});
    } else {
      let toSocketId = userService.getSocketIDByNickname(to);
      
      socket.emit("chat-message", {nickname: nickname, message: message, to:to});
      if(toSocketId)
        io.to(toSocketId).emit("chat-message", {nickname: nickname, message: message, to:to});
    }
  }

  return {
    chatMessage,
    chatMessageError
  }
}