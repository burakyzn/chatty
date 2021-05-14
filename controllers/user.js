const path = require("path");
const multer = require("multer");
const db = require('../core/db');
const roomMessagesRef = db.firestore().collection('roomMessages');
const userRef = db.firestore().collection('users');

var avatars = [];
var users = [];

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function(req, file, cb){
    cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
}).single("avatar");

const setAvatar = (req, res, next) => {
  upload(req, res, (err) => {
    let _nickname = req.body['nickname'];

    if(process.env.NODE_ENV === 'production'){
      //avatars[_nickname] = process.env.APP_NAME + '/uploads/' + req.file.filename;
      return;
    } else {
      avatars[_nickname] = 'http://localhost:5000/uploads/' + req.file.filename;
    }

    if(!err){
      res.json({result : 'http://localhost:5000/uploads/' + req.file.filename});
    } else {
      res.json({result : 'error'});
    }
 });
};

const register = async (req, res, next) => {
  let email = req.body['email'];
  let nickname = req.body['nickname'];
  let first = req.body['first'];
  let last = req.body['last'];
  let born = req.body['born'];
  
  const usersRef = db.firestore().collection('users');
  const snapshot = await usersRef.where('nickname', '==', nickname).get();
  if (snapshot.empty) {
    db.firestore().collection('users').doc(nickname).set({
      'email': email,
      'nickname': nickname,
      'first'   : first,
      'last'    : last,
      'born'    : born,
      'rooms' : []
    });

    console.log("Yeni kullanici kaydi yapildi. Kullanici adi : " + nickname);
    res.json({result : true});
  } else {
    res.json({result : false});
  }
};

const authVerify = async (req, res, next) => {
  let nickname = req.body['nickname'];

  await db.auth()
    .verifyIdToken(req.headers.authorization)
    .then(() => {
        console.log("Giris onaylandi. Kullanici adi : " + nickname);
        res.json({result : true});
  })
    .catch(() => res.json({result : false}));
};

const getAllUsers = () => {
  return users;
}

const getUser = (socketID) => {
  var user = users.find(user => user.socketID == socketID);
  return user;
}

const getUserSocketID = (nickname) => {
  var user = users.find(user => user.nickname == nickname);
  return user.socketID;
}

const removeUser = (socketID) => {
  users = users.filter(user => user.socketID != socketID);
}

const addUser = (user) => {
  users.push(user);
} 

// users collection altindaki userin oda bilgilerini getirir.
const getRoomsOfUser = async (socketID) => {
  let _user_doc = await userRef.doc(getUser(socketID).nickname).get();
  let _room_list = _user_doc.data().rooms;

  return _room_list;
}

// users collection altindaki userin oda listesinden iletilen odayi cikarir
// odada hic kullanici kalmazsa odanin butun mesajlari silinir
const removeRoomOfUser = async (socketID, room) => {
  let _doc = await userRef.doc(getUser(socketID).nickname).get();
  let _room_list = _doc.data().rooms;

  _room_list = _room_list.filter(function(value){ 
    return (value !== room);
  });

  await userRef.doc(getUser(socketID).nickname).update({
    'rooms': [...(_room_list)]
  });

  // eger odada kimse kalmadiysa odanin mesajlarini komple silecek
  let _snapshot = await userRef.where("rooms", "array-contains", room).get();
  if (_snapshot.empty) {
    await roomMessagesRef.doc(room).delete();
  } 
}

// firestore users collection altinda kullaniciya oda ismi ekleniyor.
const addRoomToUser = async (socketID, roomName) =>{
  var user = users.find(user => user.socketID == socketID);
  let _doc = await userRef.doc(user.nickname).get();
  await userRef.doc(user.nickname).update({
    'rooms': [...(_doc.data().rooms), roomName]
  });
}

// roomMessage collectioni altina oda ekleniyor.
const addRoom = async (roomName) => {
  let _doc = await roomMessagesRef.doc(roomName).get();
  if (!_doc.exists) {
    await roomMessagesRef.doc(roomName).set({
      messageList: []
    });
  } 
}

// tum oda listesinden gonderilen kullanicinin oda listesini cikarip katilanabilecek odalari filtreler.
const getRoomList =  async (req, res, next) => {
  let p_nickname = req.query['p_nickname'];
  let user = users.find(user => user.nickname == p_nickname);
  
  let room_list = [];

  // tum oda isimleri cekiliyor.
  let _doc_list = await roomMessagesRef.get();
  _doc_list.forEach(doc => {
    room_list.push(doc.id);
  });

  // kullanici oda isimleri cekiliyor.
  let _user_doc = await userRef.doc(user.nickname).get();
  let _user_room_list = _user_doc.data().rooms;

  // filtreleniyor.
  room_list = room_list.filter(function(value){ 
    return (_user_room_list.indexOf(value) == -1);
  });

  res.json({'result' : true,'roomList' : room_list});
};

const isUser = async (client) => {
  let _doc = await userRef.doc(client).get();
  if (_doc.exists) 
    return true;
  else 
    return false;
}

module.exports = {
  authVerify,
  register,
  setAvatar,
  avatars,
  getUser,
  getAllUsers,
  removeUser,
  removeRoomOfUser,
  addUser,
  getRoomsOfUser,
  addRoomToUser,
  addRoom,
  getRoomList,
  getUserSocketID,
  isUser
};