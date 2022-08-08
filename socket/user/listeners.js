const userService = require('../../services/userService');
const color = require('../../helpers/color');

module.exports = (io, socket) => {
  const emitters = require("./emitters")(io, socket);
  const roomEmitters = require('../room/emitters')(io,socket);

  const newUser = async (token) => {
    let verifiedNickname = await userService.getNicknameByToken(token);
    if(!verifiedNickname) return emitters.newUserError();

    var userInformation = await userService.getUserByNickname(verifiedNickname);

    var user = {
      socketID: socket.id,
      nickname: verifiedNickname,
      color: color.getRandomColor(),
      avatar: userInformation.avatarURL,
      rooms: [],
    };

    userService.addUser(user);
    emitters.onlineUsers();
    await emitters.offlineUsers();
    await roomEmitters.joinRooms(verifiedNickname);
    await roomEmitters.myRoomList(verifiedNickname);
  }

  const disconnect = async () => {
    userService.removeUser(socket.id);
    emitters.onlineUsers();
    await emitters.offlineUsers();
  };

  socket.on("new-user", newUser);
  socket.on("disconnect", disconnect);
}