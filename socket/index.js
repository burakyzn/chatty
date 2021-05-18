const userController = require('../controllers/user');
const messageController = require('../controllers/message');

// genel sistem mesaji
var systemContent = {
  nickname: '',
  color: '#000',
  system: true,
  msg: '', // mesaj olarak doldurulacak
};

// odalar icin kullanilan sistem mesaji
var systemRoomContent = {
  nickname: '',
  color: '#000',
  system: true,
  msg: '', // mesaj olarak doldurulacak
  to: '', // gidecek oda ismi olarak doldurulacak
  read: false,
};

var _io;

const listeners = (io) => {
  _io = io;

  io.on('connection', (socket) => {
    console.log('Yeni kullanici giris yapti. Socket id : ' + socket.id);

    // sistem mesaji gonderiliyor
    systemContent.msg = 'Chat sistemine hoşgeldin.';
    io.to(socket.id).emit('chat message', systemContent);

    socket.on('newuser', async (nickname) => {
      var user = {
        socketID: socket.id,
        nickname: nickname,
        color: getRandomColor(),
        avatar: null,
        rooms: [],
      };

      userController.addUser(user);

      systemContent.msg = 'Kullanıcı adını ' + nickname + ' olarak belirledin.';
      io.to(socket.id).emit('chat message', systemContent);

      // online kullanici bilgisi gonderiliyor
      emitOnlineUsers();

      // offline kullanici bilgisi gonderiliyor
      await emitOfflineUsers();

      // kullanici giris yaptiginda daha once kayitli oldugu odalara tekrar kaydi yapilir
      await joinAndEmitMyRooms(socket);

      socket.once('disconnect', async () => {
        var user = userController.getUser(socket.id);
        userController.removeUser(socket.id);

        systemContent.msg = user.nickname + ' sohbetten ayrıldı.';
        io.emit('chat message', systemContent);
        console.log('Kullanici ayrildi. Socket id : ' + socket.id);

        // guncel online kullanici listesi gonderiliyor
        emitOnlineUsers();

        // guncel offline kullanici listesi gonderiliyor
        await emitOfflineUsers();
      });

      socket.on('chat message', async (msgContent) => {
        if (userController.serverAuthVerify(msgContent.token)) {
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
            userController.avatars[user.nickname] === undefined
              ? user.avatar
              : userController.avatars[user.nickname],
            false,
            msgContent.message,
            msgContent.to
          );

          io.emit('chat message', content);
        } else {
          errorAuthMessageHandler(socked.id);
        }
      });

      socket.on('chat room message', async (msgContent) => {
        if (userController.serverAuthVerify(msgContent.token)) {
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
          var isUser = await userController.isUser(msgContent.to);
          if (!isUser) {
            messageController.addRoomMessage(
              user.nickname,
              user.color,
              userController.avatars[user.nickname] === undefined
                ? user.avatar
                : userController.avatars[user.nickname],
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
              userController.avatars[user.nickname] === undefined
                ? user.avatar
                : userController.avatars[user.nickname],
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
        } else {
          errorAuthMessageHandler(socked.id);
        }
      });

      socket.on('chat message offline', async (msgContent) => {
        if (userController.serverAuthVerify(msgContent.token)) {
          let user = userController.getUser(socket.id);
          let content = {
            nickname: user.nickname,
            color: user.color,
            avatar:
              userController.avatars[user.nickname] === undefined
                ? user.avatar
                : userController.avatars[user.nickname],
            system: false,
            msg: msgContent.message,
            to: msgContent.to,
            read: true,
          };

          messageController.addPrivateMessage(
            user.nickname,
            user.color,
            user.avatar,
            false,
            msgContent.message,
            msgContent.to,
            false
          );

          io.to(socket.id).emit('chat message', content);
        } else {
          errorAuthMessageHandler(socked.id);
        }
      });
    });

    socket.on('create room', async (content) => {
      if (userController.serverAuthVerify(content.token)) {
        socket.join(content.room);

        await userController.addRoom(content.room);
        await userController.addRoomToUser(socket.id, content.room);

        await emitRoomListOfUser(socket.id);

        systemRoomContent.msg =
          content.nickname + ', ' + content.room + ' odasini kurdu.';
        systemRoomContent.to = content.room;

        io.to(content.room).emit('chat message', systemRoomContent);
      } else {
        errorAuthMessageHandler(socked.id);
      }
    });

    socket.on('join room', async (content) => {
      if (userController.serverAuthVerify(content.token)) {
        socket.join(content.room);
        await userController.addRoomToUser(socket.id, content.room);

        await emitRoomListOfUser(socket.id);

        systemRoomContent.msg = content.nickname + ' odaya katildi.';
        systemRoomContent.to = content.room;
        io.to(content.room).emit('chat message', systemRoomContent);
      } else {
        errorAuthMessageHandler(socked.id);
      }
    });

    socket.on('delete user from room', async (content) => {
      if (userController.serverAuthVerify(content.token)) {
        await userController.removeRoomOfUser(socket.id, content.room);

        await emitRoomListOfUser(socket.id);

        socket.leave(content.room);

        systemRoomContent.msg = content.nickname + ' odadan ayrildi.';
        systemRoomContent.to = content.room;

        io.to(content.room).emit('chat message', systemRoomContent);
      } else {
        errorAuthMessageHandler(socked.id);
      }
    });
  });
};

// online kullanici bilgisi sisteme bagli kullanicilara yayilir
const emitOnlineUsers = () => {
  let onlineUsers = userController.getOnlineUsers();
  _io.emit('onlineusers', { userList: [...onlineUsers] });
};

// offline kullanici bilgisi sisteme bagli kullanicilara yayilir
const emitOfflineUsers = async () => {
  let oflineUsers = await userController.getOfflineUsers();
  _io.emit('offlineusers', { userList: [...oflineUsers] });
};

// kullanicinin guncel oda listesini yayar
const emitRoomListOfUser = async (socketId) => {
  let roomList = await userController.getRoomsOfUser(socketId);
  _io.to(socketId).emit('my room list', {
    myRoomList: [...roomList],
  });
};

// daha once katilinan odalara socket baglantisi yapar ve oda listesini yayar
const joinAndEmitMyRooms = async (socket) => {
  let roomList = await userController.getRoomsOfUser(socket.id);
  roomList.forEach((roomName) => {
    socket.join(roomName);
  });

  await emitRoomListOfUser(socket.id);
};

// kullanici tokeni onaylanmadiginda cagrilir hesap ile giris yapilmadi system mesaji gonderir.
const errorAuthMessageHandler = (socketId) => {
  systemContent.msg = 'Hesap ile giriş yapmadın!';
  _io.to(socketId).emit('chat message', systemContent);
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
