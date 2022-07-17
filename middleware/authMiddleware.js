
const userService = require('../services/userService');

module.exports = async (req, res, next) => {
  let token = req.headers.authorization;
  
  let verifiedNickname = await userService.getNicknameByToken(token);
  if(!verifiedNickname) {
    return res.status(401).send({ success: false, code: "unauthorized-token", message: "Token is not valid!" });
  }

  var userDetails = await userService.getUserByNickname(verifiedNickname);
  req.userClaims = {
    nickname: verifiedNickname,
    avatar: userDetails.avatarURL,
    aboutMe: userDetails.aboutMe
  }

  next();
}