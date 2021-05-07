var nicknames = [];
var avatars = [];
const path = require("path");
const multer = require("multer");

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
    console.log(req.body['nickname']);
    var _nickname = req.body['nickname'];
    console.log("Request file ---", req.file.filename);//Here you get file.
    avatars[_nickname] = 'http://localhost:5000/uploads/' + req.file.filename;
    console.log(avatars[_nickname]);
    /*Now do where ever you want to do*/
    if(!err){
      console.log("Fotograf yuklendi. Data : " + req);
      res.json({result : 'http://localhost:5000/uploads/' + req.file.filename});
    } else {
      res.json({result : 'null'});
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

module.exports = {
  setNickname,
  setAvatar,
  avatars
};