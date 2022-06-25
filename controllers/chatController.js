const chatService = require('../services/chatService');

const getPublicMessages = async (req, res, next) => {
  let result = await chatService.getPublicMessages();
  res.json({ success: true, messages : result.messages});
};

module.exports = {
  getPublicMessages
};