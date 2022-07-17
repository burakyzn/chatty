const {database, auth} = require('../core/firebase');
const userCollectionRef = database.collection('users');

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

  await auth.getUserByEmail(email)
  .then(user => {
    auth.updateUser(user.uid, {
      displayName : nickname
    })
  })
  .catch(error => {
    console.error("saveUser :", error)
    return false;
  });

  return true;
}

module.exports = {
  saveUser
};