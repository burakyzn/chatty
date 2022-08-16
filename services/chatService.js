const {database} = require('../core/firebase');
const roomMessagesRef = database.collection('roomMessages');

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

const getRoomMessages = async (roomName) => {
  let messages = await roomMessagesRef
  .doc(roomName)
  .collection("messages")
  .orderBy("date")
  .get();

  messages = messages.docs.map(message => {
    let messageDoc = message.data();
    return {
      date: messageDoc.date,
      to: messageDoc.to,
      nickname: messageDoc.nickname,
      message: messageDoc.message
    }
  });

  return {messages: messages};
}

const createRoom = async (roomName, founder, members) => {
  await roomMessagesRef.doc(roomName).set({
    count: members.length + 1
  });

  await saveMessage("System", `${founder} create this room`, roomName, new Date().getTime());
  for(let member of members){
    await saveMessage("System", `${founder} added ${member} to this room`, roomName, new Date().getTime());
  }
}

const roomExist = async (roomName) => {
  let room = await roomMessagesRef.doc(roomName).get();
  return room.exists;
}

const deleteRoom = async (roomName) => {
  let batch = database.batch();

  await roomMessagesRef
    .doc(roomName)
    .collection('messages')
    .listDocuments()
    .then(roomMessages => {
      roomMessages.map((message) => {
        batch.delete(message)
      })
    
      batch.commit()
    });
}

module.exports = {
  saveMessage,
  getPublicMessages,
  getPrivateMessages,
  getRoomMessages,
  roomExist,
  createRoom,
  deleteRoom
};