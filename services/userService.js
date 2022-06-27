const db = require('../core/db');
const userCollectionRef = db.firestore().collection('users');
var users = [];

const addUser = (user) => {
  users.push(user);
};

const removeUser = (socketID) => {
  users = users.filter((user) => user.socketID !== socketID);
};

const getOnlineUsers = () => {
  return users.map(user => (
    {socketID: user.socketID, nickname: user.nickname, avatar: user.avatar}
  ));
};

const getOfflineUsers = async () => {
  let usersCollection = await userCollectionRef.get();
  let userList = [];

  usersCollection.forEach((docUser) => {
    if (users.findIndex((x) => x.nickname === docUser.id) === -1) {
      let user = docUser.data();
      userList.push({nickname: user.nickname, avatar: user.avatarURL});
    }
  });

  return userList;
};

const getNicknameByToken = (token) => {
  return db.auth()
    .verifyIdToken(token)
    .then((decodedToken) => decodedToken.name)
    .catch(() => {});
}

const saveUser = async (email, nickname) => {
  let userInstance = await userCollectionRef.where('nickname', "==", nickname).get();
  if(!userInstance.empty)
    return false;

  await userCollectionRef.doc(nickname).set({
    email: email,
    nickname: nickname,
    avatarURL: null,
    rooms: [],
    status: false
  });

  return true;
}

const updateUserDisplayNameByEmail = (email, nickname) => {
  db.auth()
    .getUserByEmail(email)
    .then(user => {
      db.auth().updateUser(user.uid, {
        displayName : nickname
      })
    })
    .catch(error => console.error("updateUserDisplayNameByEmail :", error));
}

const getSocketIDByNickname = (nickname) => {
  var user = users.find((user) => user.nickname === nickname);
  return user ? user.socketID : null;
}

module.exports = {
  getNicknameByToken,
  getOnlineUsers,
  getOfflineUsers,
  getSocketIDByNickname,
  addUser,
  removeUser,
  updateUserDisplayNameByEmail,
  saveUser,
};