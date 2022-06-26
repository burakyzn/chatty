const userService = require('../services/userService');

const register = async (req, res) => {
  let email = req.body['email'];
  let nickname = req.body['nickname'];

  let result = await userService.saveUser(email, nickname);
  if(!result) {
    res.json({ success: result, code: "duplicated-nickname", message: "Nickname is already used!" });
    return;
  }

  userService.updateUserDisplayNameByEmail(email, nickname);
  res.json({success: result, message: "The user has been created."});
};

const getNickname = async (req, res) => {
  let verifiedNickname = await userService.getNicknameByToken(req.headers.authorization);
  if(!verifiedNickname) {
    res.json({ success: false, code: "unauthorized-token", message: "Token is not valid!" });
    return;
  }

  res.json({success: true, nickname: verifiedNickname});
};

module.exports = {
  register,
  getNickname
};
