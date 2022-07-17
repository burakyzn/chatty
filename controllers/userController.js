const userService = require('../services/userService');

const getUsers = async (req,res) => {
  let result = await userService.getUsers();
  return res.json(result);
}

const getUserDetails = async (req, res) => {
  res.json({
    success: true, 
    nickname: req.userClaims.nickname,
    avatar: req.userClaims.avatar, 
    aboutMe: req.userClaims.aboutMe
  });
};

const updateAboutMe = async (req,res) => {
  let nickname = req.userClaims.nickname;
  let aboutMe = req.body.aboutMe;
  
  let result = await userService.updateAboutMe(nickname, aboutMe);
  res.json(result);
}

const updateAvatar = async (req,res) => {
  let image = req.file.buffer;
  let nickname = req.userClaims.nickname;

  let url = await userService.updateAvatar(image, nickname);
  await userService.updateUserAvatarUrl(url, nickname);

  res.json({success: true, message: "You updated your profile photo successfully!", url: url});
}

module.exports = {
  getUserDetails,
  updateAvatar,
  updateAboutMe,
  getUsers
};
