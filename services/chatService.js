const db = require('../core/db');
const roomMessagesRef = db.firestore().collection('roomMessages');

const saveMessage = async (nickname, message, to, date) => {
  roomMessagesRef.doc(to).collection("messages")
    .add({
      nickname: nickname,
      message: message,
      to: to,
      date: date
    })
    .catch(() => {console.log('saveMessage - Transaction sirasinda hata olustu! ', e)});
};

const getPublicMessages = async () => {
  let publicMessageDocs = await roomMessagesRef.doc("Public").collection("messages").get();

  let publicMessages = publicMessageDocs.docs.map(message => {
    let messageDoc = message.data();
    return {
      date: messageDoc.date,
      to: messageDoc.to,
      nickname: messageDoc.nickname,
      message: messageDoc.message
    }
  });

  let sortedPublicMessages = publicMessages.sort((a,b) => a.date - b.date);
  return { messages: sortedPublicMessages};
}

const getPrivateMessages = async (sender, receiver) => {
  let messageSent = await roomMessagesRef
    .doc(receiver)
    .collection("messages")
    .where("nickname", "==", sender)
    .where("to", "==", receiver)
    .orderBy("date")
    .get();

  messageSent = messageSent.docs.map(message => {
    let messageDoc = message.data();
    return {
      date: messageDoc.date,
      to: messageDoc.to,
      nickname: messageDoc.nickname,
      message: messageDoc.message
    }
  });

  let messageReceived = await roomMessagesRef
    .doc(sender)
    .collection("messages")
    .where("nickname", "==", receiver)
    .where("to", "==", sender)
    .orderBy("date")
    .get();

    messageReceived = messageReceived.docs.map(message => {
      let messageDoc = message.data();
      return {
        date: messageDoc.date,
        to: messageDoc.to,
        nickname: messageDoc.nickname,
        message: messageDoc.message
      }
    });

  let messages = [...messageSent, ...messageReceived];
  messages = messages.sort((a,b) => a.date - b.date);

  return {messages: messages};
}

module.exports = {
  saveMessage,
  getPublicMessages,
  getPrivateMessages
};