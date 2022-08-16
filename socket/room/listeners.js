const userService = require('../../services/userService');
const chatService = require('../../services/chatService');

module.exports = (io, socket) => {
  const emitters = require("./emitters")(io, socket);

  const createRoom = async (roomContent) => {
    let nickname = socket.userClaims.nickname;

    let roomExist = await chatService.roomExist(roomContent.name);
    if(roomExist)
      return emitters.createRoomError("A room with the same name already exists!");
      
    socket.join(roomContent.name);
    await userService.addRoomToUsers([nickname, ...roomContent.nicknames], roomContent.name);
    await emitters.myRoomList([nickname, ...roomContent.nicknames]);
    chatService.createRoom(roomContent.name, nickname, roomContent.nicknames);
    emitters.createRoomSuccess();
  }

  const leaveRoom = async (roomContent) => {
    let nickname = socket.userClaims.nickname;

    await userService.removeRoomFromUser(nickname, roomContent.room);
    socket.leave(roomContent.room);
    emitters.myRoomList([nickname]);
  }

  socket.on("create-room", createRoom);
  socket.on("leave-room", leaveRoom);
}