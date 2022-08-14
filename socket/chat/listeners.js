const userService = require('../../services/userService');
const chatService = require('../../services/chatService');

module.exports = (io, socket) => {
  const emitters = require("./emitters")(io, socket);

  const chatMessage = async (content) => {
    let verifiedNickname = await userService.getNicknameByToken(content.token);
    if(!verifiedNickname) return emitters.chatMessageError();

    let verifiedContent = {
      ...content,
      nickname: verifiedNickname,
      date: new Date().getTime()
    }

    emitters.chatMessage(verifiedContent.nickname, verifiedContent.message, verifiedContent.to, verifiedContent.date);
    return await chatService.saveMessage(verifiedContent.nickname, verifiedContent.message, verifiedContent.to, verifiedContent.date);
  }

  socket.on("chat-message", chatMessage);
}