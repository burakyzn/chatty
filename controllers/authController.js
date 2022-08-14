const authService = require('../services/authService');

const register = async (req, res) => {
  let email = req.body['email'];
  let nickname = req.body['nickname'];

  let result = await authService.saveUser(email, nickname);
  res.json(result);
};

module.exports = {
  register
};