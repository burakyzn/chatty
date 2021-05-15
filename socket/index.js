const userController = require('../controllers/user');
const messageController = require('../controllers/message');

const listeners = (io) => {
  io.on('connection', (socket) => {
    console.log('Yeni kullanici giris yapti. Socket id : ' + socket.id);

    var sysContent = {
      nickname: '',
      color: '#000',
      system: true,
      msg: '',
    };

    sysContent.msg = 'Chat sistemine hoşgeldin.';
    io.to(socket.id).emit('chat message', sysContent);

    socket.on('newuser', (nickname) => {
      var user = {
        socketID: socket.id,
        nickname: nickname,
        color: getRandomColor(),
        avatar: null,
        rooms: [],
      };

      userController.addUser(user);

      sysContent.msg = 'Kullanıcı adını ' + nickname + ' olarak belirledin.';
      io.to(socket.id).emit('chat message', sysContent);

      var users = userController.getAllUsers();
      io.emit('onlineusers', { userList: [...users] });

      socket.once('disconnect', () => {
        var user = userController.getUser(socket.id);
        sysContent.msg = user.nickname + ' sohbetten ayrıldı.';
        userController.removeUser(socket.id);

        io.emit('chat message', sysContent);
        console.log('Kullanici ayrildi. Socket id : ' + socket.id);

        var users = userController.getAllUsers();
        io.emit('onlineusers', { userList: [...users] });
      });

      socket.on('chat message', async (msgContent) => {
        var user = userController.getUser(socket.id);
        var content = {
          nickname: user.nickname,
          color: user.color,
          avatar:
            userController.avatars[user.nickname] === undefined
              ? user.avatar
              : userController.avatars[user.nickname],
          system: false,
          msg: msgContent.message,
          to: msgContent.to,
          read: false,
        };

        messageController.addPublicMessage(
          user.nickname,
          user.color,
          user.avatar,
          false,
          msgContent.message,
          msgContent.to
        );

        io.emit('chat message', content);
      });

      socket.on('chat room message', (msgContent) => {
        var user = userController.getUser(socket.id);
        var content = {
          nickname: user.nickname,
          color: user.color,
          avatar:
            userController.avatars[user.nickname] === undefined
              ? user.avatar
              : userController.avatars[user.nickname],
          system: false,
          msg: msgContent.message,
          to: msgContent.to,
          read: false,
        };

        if (!userController.isUser(msgContent.to)) {
          messageController.addRoomMessage(
            user.nickname,
            user.color,
            user.avatar,
            false,
            msgContent.message,
            msgContent.to,
            false
          );

          io.to(msgContent.to).emit('chat message', content);
        } else {
          messageController.addPrivateMessage(
            user.nickname,
            user.color,
            user.avatar,
            false,
            msgContent.message,
            msgContent.to,
            false
          );

          io.to(userController.getUserSocketID(msgContent.to)).emit(
            'chat message',
            content
          );
          io.to(socket.id).emit('chat message', content);
        }
      });
    });

    socket.on('create room', async (content) => {
      socket.join(content.room);

      await userController.addRoom(content.room);
      await userController.addRoomToUser(socket.id, content.room);
      let rooms = await userController.getRoomsOfUser(socket.id);

      io.to(socket.id).emit('my room list', {
        myRoomList: [...rooms],
      });

      let sysContent = {
        nickname: '',
        color: '#000',
        system: true,
        msg: content.nickname + ', ' + content.room + ' odasini kurdu.',
        to: content.room,
        read: false,
      };

      io.to(content.room).emit('chat message', sysContent);
    });

    socket.on('join room', async (content) => {
      socket.join(content.room);
      await userController.addRoomToUser(socket.id, content.room);
      let rooms = await userController.getRoomsOfUser(socket.id);
      io.to(socket.id).emit('my room list', {
        myRoomList: [...rooms],
      });

      let sysContent = {
        nickname: '',
        color: '#000',
        system: true,
        msg: content.nickname + ' odaya katildi.',
        to: content.room,
        read: false,
      };

      io.to(content.room).emit('chat message', sysContent);
    });

    socket.on('delete user from room', async (content) => {
      await userController.removeRoomOfUser(socket.id, content.room);
      let rooms = await userController.getRoomsOfUser(socket.id);
      io.to(socket.id).emit('my room list', {
        myRoomList: [...rooms],
      });

      socket.leave(content.room);
      let sysContent = {
        nickname: '',
        color: '#000',
        system: true,
        msg: content.nickname + ' odadan ayrildi!',
        to: content.room,
        read: false,
      };

      io.to(content.room).emit('chat message', sysContent);
    });
  });
};

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

module.exports = {
  listeners,
};
