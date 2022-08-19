
const userService = require('../services/userService');

const apiAuth = async (req, res, next) => {
  let token = req.headers.authorization;
  if(!token)
    return res.status(401).send({ success: false, code: "token-required", message: "Token is required!" });

  let verifiedNickname = await userService.getNicknameByToken(token);
  if(!verifiedNickname) 
    return res.status(401).send({ success: false, code: "unauthorized-token", message: "Token is not valid!" });

  var userDetails = await userService.getUserByNickname(verifiedNickname);
  req.userClaims = {
    nickname: verifiedNickname,
    avatar: userDetails.avatar,
    aboutMe: userDetails.aboutMe
  }

  next();
}

const socketAuth = async (socket, next) => {
  let token = socket.handshake.auth.token;
  if(!token){
    socket.emit("new-user-error", "unauthorized-token");
    return;
  }

  let verifiedNickname = await userService.getNicknameByToken(token);
  if(!verifiedNickname) {
    socket.emit("new-user-error", "unauthorized-token");
    return;
  }

  var userInformation = await userService.getUserByNickname(verifiedNickname);

  socket.userClaims = {
    nickname: verifiedNickname,
    avatar: userInformation.avatar
  };
  next();
}

module.exports = {
  apiAuth,
  socketAuth
}