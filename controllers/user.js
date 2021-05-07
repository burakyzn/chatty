var nicknames = [];

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
  setNickname
};