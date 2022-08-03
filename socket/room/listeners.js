const userService = require('../../services/userService');
const roomService = require('../../services/roomService');

module.exports = (io, socket) => {
  const emitters = require("./emitters")(io, socket);

  const createRoom = async (roomContent) => {
    let verifiedNickname = await userService.getNicknameByToken(roomContent.token);
    if(!verifiedNickname) return emitters.createRoomError();

    // TODO: check uniqueness of room name 
    socket.join(roomContent.name);
    await roomService.createRoom(roomContent.name);
    await userService.addRoomToUsers([verifiedNickname, ...roomContent.nicknames], roomContent.name);
  }

  socket.on("create-room", createRoom);
}