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

const getUsers = async () => {
  let userCollection = await userCollectionRef.get();
  let users = userCollection.docs.map((userDocument) => {
    let userData = userDocument.data();
    return {
      nickname: userData.nickname,
      avatar: userData.avatarURL,
    }
  });
  return {success: true, users: users};
}

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
  let userDocument = await userCollectionRef.doc(nickname).get();
  return userDocument.data();
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
    status: false,
    aboutMe: "hi, I'm new here!"
  });

  return true;
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

const updateAvatar = async (image, nickname) => {
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

const updateAboutMe = async (nickname, aboutMe) => {
  await userCollectionRef.doc(nickname).update({
    aboutMe: aboutMe
  });

  return {success : true, message: "You updated about section successfully!"}
}

const addRoomToUsers = async (nicknames, roomName) => {
  for await (const nickname of nicknames) {
    let user = await userCollectionRef.doc(nickname).get();
    await userCollectionRef.doc(nickname).update({
      rooms: [...user.data().rooms, roomName],
    });
  }
};

const getRoomListOfUser = async (nickname) => {
  let user = await userCollectionRef.doc(nickname).get();
  return user.data().rooms;
};

module.exports = {
  getNicknameByToken,
  getUserByNickname,
  getOnlineUsers,
  getOfflineUsers,
  getSocketIDByNickname,
  getUsers,
  addUser,
  removeUser,
  saveUser,
  updateAvatar,
  updateUserAvatarUrl,
  updateAboutMe,
  addRoomToUsers,
  getRoomListOfUser
};