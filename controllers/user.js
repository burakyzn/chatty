const path = require("path");
const multer = require("multer");

var nicknames = [];
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
    var _nickname = req.body['nickname'];

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

const setNickname = (req, res, next) => {
  var p_nickname = req.query['p_nickname'];
  if(nicknames.indexOf(p_nickname) == -1){
    console.log("Yeni kullanici kaydi yapildi. Kullanici adi : " + p_nickname);
    nicknames.push(p_nickname);
    res.json({result : true});
  } else {
    res.json({result : false});
  }
};

const getAllUsers = () => {
  return users;
}

const getUser = (socketID) => {
  var user = users.find(user => user.socketID == socketID);
  return user;
}

const removeUser = (socketID) => {
  users = users.filter(user => user.socketID != socketID);
}

const addUser = (user) => {
  users.push(user);
} 

module.exports = {
  setNickname,
  setAvatar,
  avatars,
  getUser,
  getAllUsers,
  removeUser,
  addUser
};