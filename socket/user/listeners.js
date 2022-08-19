const userService = require('../../services/userService');

module.exports = (io, socket) => {
  const emitters = require("./emitters")(io, socket);
  const roomEmitters = require('../room/emitters')(io,socket);

  const newUser = async () => {
    let nickname = socket.userClaims.nickname;

    var user = {
      socketID: socket.id,
      nickname: nickname,
      avatar: socket.userClaims.avatar,
      rooms: [],
    };
    
    userService.addUser(user);
    emitters.onlineUsers();
    await emitters.offlineUsers();
    await roomEmitters.joinRooms(nickname);
    await roomEmitters.myRoomList([nickname]);
  }

  const disconnect = async () => {
    userService.removeUser(socket.id);
    emitters.onlineUsers();
    await emitters.offlineUsers();
  };

  socket.on("new-user", newUser);
  socket.on("disconnect", disconnect);
}