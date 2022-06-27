const chatService = require('../services/chatService');
const userService = require('../services/userService');

const getPublicMessages = async (req, res, next) => {
  let result = await chatService.getPublicMessages();
  res.json({ success: true, messages : result.messages});
};

const getPrivateMessages = async (req, res, next) => {
  let token = req.headers.authorization;
  let receiver = req.params["nickname"];
  
  const sender = await userService.getNicknameByToken(token);
  if(!sender){
    res.json({ success: false, code: "unauthorized-token", message: "Token is not valid!" });
    return;
  }

  let result = await chatService.getPrivateMessages(sender, receiver);
  res.json({ success: true, messages : result.messages});
};


module.exports = {
  getPublicMessages,
  getPrivateMessages
};