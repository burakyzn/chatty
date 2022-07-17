const chatService = require('../services/chatService');

const getPublicMessages = async (req, res, next) => {
  let result = await chatService.getPublicMessages();
  res.json({ success: true, messages : result.messages});
};

const getPrivateMessages = async (req, res, next) => {
  let receiver = req.params["nickname"];
  let sender = req.userClaims.nickname;

  let result = await chatService.getPrivateMessages(sender, receiver);
  res.json({ success: true, messages : result.messages});
};


module.exports = {
  getPublicMessages,
  getPrivateMessages
};