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

const getUserDetails = async (req, res) => {
  let verifiedNickname = await userService.getNicknameByToken(req.headers.authorization);
  if(!verifiedNickname) {
    res.json({ success: false, code: "unauthorized-token", message: "Token is not valid!" });
    return;
  }

  var userDetails = await userService.getUserByNickname(verifiedNickname);
  res.json({success: true, nickname: verifiedNickname, avatar:  userDetails.avatarURL});
};

const uploadAvatar = async (req,res) => {
  let nickname = req.params["nickname"];
  let image = req.file.buffer;

  let url = await userService.uploadAvatar(image, nickname);
  await userService.updateUserAvatarUrl(url, nickname);

  res.json({success: true, message: "You updated your profile photo successfully!", url: url});
}

module.exports = {
  register,
  getUserDetails,
  uploadAvatar
};
