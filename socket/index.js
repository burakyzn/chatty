
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
        "avatar" : null,
        'rooms' : ['Ornek Grup']
      };

      userController.addUser(user);

      sysContent.msg = 'Kullanıcı adını ' + nickname + ' olarak belirledin.';
      io.to(socket.id).emit('chat message', sysContent);

      var users = userController.getAllUsers();
      io.emit('onlineusers', {"userList" : [...users]});

      var rooms = userController.getRooms();
      io.to(socket.id).emit('room list', {"roomList" : [...rooms]});

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

      socket.on('chat room message', (msgContent) => {
        var user = userController.getUser(socket.id);
        var content = {
          'nickname' : user.nickname,
          'color' : user.color,
          'avatar' : userController.avatars[user.nickname] === undefined ? user.avatar : userController.avatars[user.nickname],
          'system' : false,
          'msg' : msgContent.message,
          'to' : msgContent.to
        }
        
        io.to(msgContent.to).emit('chat message', content);
      });

      socket.on('create room', (roomName) => {
        socket.join(roomName);
        userController.addRoomToUser(socket.id, roomName);
        userController.addRoom(roomName);
        var rooms = userController.getRooms();
        io.emit('room list', {"roomList" : [...rooms]});
      });

      socket.on('join room', (roomName) => {
        socket.join(roomName);
        userController.addRoomToUser(socket.id, roomName);
      });
    });

    io.of("/").adapter.on("create-room", (room) => {
      console.log(`Yeni oda kuruldu :  ${room}`);
    });

    io.of("/").adapter.on("join-room", (room, id) => {
      console.log(`${id} socket idli kullanici odaya katildi. ${room}`);
      io.to(room).emit('Yeni kullanici odaya katildi!');
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