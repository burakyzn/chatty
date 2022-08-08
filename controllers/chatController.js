const chatService = require('../services/chatService');
const userService = require('../services/userService');

const getPublicMessages = async (req, res, next) => {
  let result = await chatService.getPublicMessages();
  res.json({ success: true, messages : result.messages});
};

// TODO : change nickname parameter name
const getPrivateMessages = async (req, res, next) => {
  let receiver = req.params["nickname"];
  let sender = req.userClaims.nickname;

  let user = await userService.getUserByNickname(receiver);
  let result = user ? await chatService.getPrivateMessages(sender, receiver) :  await chatService.getRoomMessages(receiver);
  res.json({ success: true, messages : result.messages});
};

module.exports = {
  getPublicMessages,
  getPrivateMessages
};