const {database, storage, auth} = require('../core/firebase');
const { v4: uuidv4 } = require('uuid');

const userCollectionRef = database.collection('users');
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
  return auth
    .verifyIdToken(token)
    .then((decodedToken) => decodedToken.name)
    .catch(() => {});
}

const getUserByNickname = async (nickname) => {
  let usersCollection = await userCollectionRef.doc(nickname).get();
  return usersCollection.data();
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
    auth.getUserByEmail(email)
    .then(user => {
      auth.updateUser(user.uid, {
        displayName : nickname
      })
    })
    .catch(error => console.error("updateUserDisplayNameByEmail :", error));
}

const updateUserAvatarUrl = async (url, nickname) => {
  await userCollectionRef.doc(nickname).update({
    avatarURL: url
  });
}

const getSocketIDByNickname = (nickname) => {
  var user = users.find((user) => user.nickname === nickname);
  return user ? user.socketID : null;
}

const uploadAvatar = async (image, nickname) => {
  let uuid = uuidv4();
  let filePath = `avatars/${nickname}.png`;

  return await storage.bucket()
    .file(filePath)
    .save(image, {
      gzip: true,
      contentType: 'image/png',
      metadata: {
        firebaseStorageDownloadTokens: uuid
      }
    })
    .then(() => "https://firebasestorage.googleapis.com/v0/b/" + storage.bucket().name + "/o/" + encodeURIComponent(filePath) + "?alt=media&token=" + uuid)
    .catch(error => console.error(error))
}

module.exports = {
  getNicknameByToken,
  getUserByNickname,
  getOnlineUsers,
  getOfflineUsers,
  getSocketIDByNickname,
  addUser,
  removeUser,
  updateUserDisplayNameByEmail,
  saveUser,
  uploadAvatar,
  updateUserAvatarUrl
};