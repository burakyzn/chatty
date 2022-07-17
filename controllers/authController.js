const authService = require('../services/authService');

const register = async (req, res) => {
  let email = req.body['email'];
  let nickname = req.body['nickname'];

  let result = await authService.saveUser(email, nickname);
  if(!result) {
    res.json({ success: result, code: "duplicated-nickname", message: "Nickname is already used!" });
    return;
  }
  
  res.json({success: result, message: "The user has been created."});
};

module.exports = {
  register
};