
const userController = require('../controllers/user'); 

const listeners = io => {
  io.on('connection', (socket) => {
    console.log('Yeni kullanici giris yapti. Socket id : ' + socket.id);
  
    var sysContent = {
      nickname : '',
      color : '#000',
      system : true,
      msg : ''
    }
  
    sysContent.msg = 'Chat sistemine hoşgeldin.';
    io.to(socket.id).emit('chat message', sysContent);

    socket.on('newuser', nickname => {
      var user = {
        "socketID" : socket.id,
        "nickname" : nickname,
        "color" : getRandomColor(),
        "avatar" : null
      };

      userController.addUser(user);

      sysContent.msg = 'Kullanıcı adını ' + nickname + ' olarak belirledin.';
      io.to(socket.id).emit('chat message', sysContent);

      var users = userController.getAllUsers();
      io.emit('onlineusers', {"userList" : [...users]});

      socket.once('disconnect', ()=>{
        var user = userController.getUser(socket.id);
        sysContent.msg = user.nickname + ' sohbetten ayrıldı.';
        userController.removeUser(socket.id);
        
        io.emit('chat message', sysContent);
        console.log('Kullanici ayrildi. Socket id : ' + socket.id);

        var users = userController.getAllUsers();
        io.emit('onlineusers', {"userList" : [...users]});
      });
      
      socket.on('chat message', (msgContent) => {
        var user = userController.getUser(socket.id);
        var content = {
          'nickname' : user.nickname,
          'color' : user.color,
          'avatar' : userController.avatars[user.nickname] === undefined ? user.avatar : userController.avatars[user.nickname],
          'system' : false,
          'msg' : msgContent.message,
          'to' : msgContent.to
        }
        
        io.emit('chat message', content);
      });
    });
  });
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

module.exports = {
  listeners
};