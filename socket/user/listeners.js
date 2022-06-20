const userController = require('../../controllers/user');
const userService = require('../../services/userService');
const color = require('../../helpers/color');

module.exports = (io, socket) => {
  const emitters = require("./emitters")(io, socket);

  const newUser = async (token) => {
    let verifiedNickname = await userService.getNicknameByToken(token);
    if(!verifiedNickname) emitters.newUserError();

    var user = {
      socketID: socket.id,
      nickname: verifiedNickname,
      color: color.getRandomColor(),
      avatar: null,
      rooms: [],
    };

    userController.addUser(user);
    emitters.onlineUsers();
    await emitters.offlineUsers();
  }

  const disconnect = async () => {
    userController.removeUser(socket.id);
    emitters.onlineUsers();
    await emitters.offlineUsers();
  };

  socket.on("new-user", newUser);
  socket.on("disconnect", disconnect);
}