const db = require('../core/db');

const getNicknameByToken = (token) => {
  return db.auth()
    .verifyIdToken(token)
    .then((decodedToken) => decodedToken.name)
    .catch((error) => {
      console.error(error);
      return "";
    });
}

module.exports = {
  getNicknameByToken
};