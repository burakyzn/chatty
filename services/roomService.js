const {database} = require('../core/firebase');
const roomMessagesRef = database.collection('roomMessages');

const createRoom = async (roomName) => {
  let _doc = await roomMessagesRef.doc(roomName).get();
  if (!_doc.exists) {
    await roomMessagesRef.doc(roomName).set({
      messageList: [],
    });
  }
};


module.exports = {
  createRoom
};