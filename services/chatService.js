const db = require('../core/db');
const roomMessagesRef = db.firestore().collection('roomMessages');

const saveMessage = async (nickname, message, to) => {
  let roomDoc = await roomMessagesRef.doc(to).get();
  
  if (!roomDoc.exists) {
    await roomMessagesRef.doc(to).set({
      messages: [],
    });
    roomDoc = await roomMessagesRef.doc(to).get();
  }

  try {
    await db.firestore().runTransaction(async (t) => {
      let messages = roomDoc.data().messages;

      messages.push({
        nickname: nickname,
        message: message,
        to: to
      });
      t.update(roomMessagesRef.doc(to), { messages: messages });
    });
  } catch (e) {
    console.log('saveMessage - Transaction sirasinda hata olustu! ', e);
  }
};

const getPublicMessages = async () => {
  try {
    let publicDoc = await roomMessagesRef.doc("Public").get();

    if (!publicDoc.exists) 
      return { messages: [] };
    else 
      return { messages: publicDoc.data().messages };
  } catch (e) {
    console.log('getPublicMessages - Transaction sirasinda bir hata olustu! ', e);
  }
}

module.exports = {
  saveMessage,
  getPublicMessages
};