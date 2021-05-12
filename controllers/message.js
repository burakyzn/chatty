const db = require('../core/db');
const publicMessageRef = db.collection('roomMessages').doc('public');
const roomMessagesRef = db.collection('roomMessages');
const privateMessagesRef = db.collection('privateMessages');

// GET 

const getPublicMessageList = async (req,res,next) => {
  let _doc = await publicMessageRef.get();
  if (!_doc.exists) {
    res.json({messageList : []});
  } else {
    res.json({messageList : _doc.data().messageList});
  }
}

const getPrivateMessageList = async (req,res,next) => {
  let unsorted_username = [req.query['p_from'], req.query['p_to']];
  let sorted_username = unsorted_username.sort((a, b) => a.localeCompare(b));
  let _doc_name = sorted_username[0] + '-' + sorted_username[1];

  let _doc = await privateMessagesRef.doc(_doc_name).get();
  if (!_doc.exists) {
    res.json({messageList : []});
  } else {
    res.json({messageId : _doc_name, messageList : _doc.data().messageList});
  }
}

// ADD

const addPublicMessage = async (nickname, color, avatar, system, msg, to) => {
  let _doc = await publicMessageRef.get();
  if (!_doc.exists) {
    await publicMessageRef.set({
      messageList: []
    });
  } 

  try {
    await db.runTransaction(async (t) => {
      let _doc = await t.get(publicMessageRef);
      let _messages = _doc.data().messageList;
      _messages.push({
        'nickname' : nickname,
        'color' : color,
        'avatar' : avatar,
        'system' : system,
        'msg' : msg,
        'to' : to,
        'read' : true,
      })
      t.update(publicMessageRef, {'messageList': _messages});
    });
  } catch (e) {
    console.log('Transaction sirasinda hata olustu ! Hata : ', e);
  }
}

const addRoomMessage = async (nickname, color, avatar, system, msg, to) => {
  let _doc = await roomMessagesRef.doc(to).get();
  if (!_doc.exists) {
    await roomMessagesRef.doc(to).set({
      messageList: []
    });
  } 

  try {
    await db.runTransaction(async (t) => {
      let _doc = await t.get(roomMessagesRef.doc(to));
      let _messages = _doc.data().messageList;
      _messages.push({
        'nickname' : nickname,
        'color' : color,
        'avatar' : avatar,
        'system' : system,
        'msg' : msg,
        'to' : to,
        'read' : true,
      })
      t.update(roomMessagesRef.doc(to), {'messageList': _messages});
    });
  } catch (e) {
    console.log('Transaction sirasinda hata olustu ! Hata : ', e);
  }
}

const addPrivateMessage = async (nickname, color, avatar, system, msg, to) => {
  let unsorted_username = [nickname, to];
  let sorted_username = unsorted_username.sort((a, b) => a.localeCompare(b));
  let _doc_name = sorted_username[0] + '-' + sorted_username[1];

  let _doc = await privateMessagesRef.doc(_doc_name).get();
  if (!_doc.exists) {
    await privateMessagesRef.doc(_doc_name).set({
      messageList: []
    });
  } 

  try {
    await db.runTransaction(async (t) => {
      let _doc = await t.get(privateMessagesRef.doc(_doc_name));
      let _messages = _doc.data().messageList;
      _messages.push({
        'nickname' : nickname,
        'color' : color,
        'avatar' : avatar,
        'system' : system,
        'msg' : msg,
        'to' : to,
        'read' : true,
      })
      t.update(privateMessagesRef.doc(_doc_name), {'messageList': _messages});
    });
  } catch (e) {
    console.log('Transaction sirasinda hata olustu ! Hata : ', e);
  }
}

module.exports = {
  getPublicMessageList,
  getPrivateMessageList,
  addPublicMessage,
  addRoomMessage,
  addPrivateMessage
}