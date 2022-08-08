const userService = require('../../services/userService');

module.exports = (io, socket) => {
  const chatMessageError = () => {
    socket.emit("chat-message-error", "unauthorized-token");
  }

  // TODO : refactor it 
  const chatMessage = async (nickname, message, to, date) => {
    if(to === "Public"){
      io.emit("chat-message", {nickname: nickname, message: message, to:to});
    } else {

      let user = await userService.getUserByNickname(to);
      let toSocketId = user ? await userService.getSocketIDByNickname(to) : to;

      if(user)
        socket.emit("chat-message", {nickname: nickname, message: message, to:to});
      if(toSocketId){
        io.to(toSocketId).emit("chat-message", {nickname: nickname, message: message, to:to});
      }
    }
  }

  return {
    chatMessage,
    chatMessageError
  }
}