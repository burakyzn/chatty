const userService = require('../services/userService');

const getUserDetails = async (req, res) => {
  res.json({
    success: true, 
    nickname: req.userClaims.nickname,
    avatar: req.userClaims.avatar, 
    aboutMe: req.userClaims.aboutMe
  });
};

const uploadAvatar = async (req,res) => {
  let image = req.file.buffer;
  let nickname = req.userClaims.nickname;

  let url = await userService.uploadAvatar(image, nickname);
  await userService.updateUserAvatarUrl(url, nickname);

  res.json({success: true, message: "You updated your profile photo successfully!", url: url});
}

module.exports = {
  getUserDetails,
  uploadAvatar
};
