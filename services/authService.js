const {database, auth} = require('../core/firebase');
const userCollectionRef = database.collection('users');

const saveUser = async (email, nickname) => {
  let userInstance = await userCollectionRef.where('nickname', "==", nickname).get();
  if(!userInstance.empty)
    return { success: false, code: "user-not-found", message: "The user couldn't be found!" };

  await userCollectionRef.doc(nickname).set({
    email: email,
    nickname: nickname,
    avatarURL: null,
    rooms: [],
    status: false,
    aboutMe: "hi, I'm new here!"
  });

  await auth.getUserByEmail(email)
  .then(user => {
    auth.updateUser(user.uid, {
      displayName : nickname
    })
  })
  .catch(error => {
    console.error("saveUser :", error)
    return { success: false, code: "duplicated-nickname", message: "Nickname is already used!" };
  });

  return {success: true, message: "The user has been created."};
}

module.exports = {
  saveUser
};