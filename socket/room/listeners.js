const userService = require('../../services/userService');

module.exports = (io, socket) => {
  const emitters = require("./emitters")(io, socket);

  const createRoom = async (roomContent) => {
    let verifiedNickname = await userService.getNicknameByToken(roomContent.token);
    if(!verifiedNickname) return emitters.createRoomError();

    // TODO: check uniqueness of room name 
    socket.join(roomContent.name);
    await userService.addRoomToUsers([verifiedNickname, ...roomContent.nicknames], roomContent.name);
    await emitters.myRoomList(verifiedNickname);
  }

  const leaveRoom = async (roomContent) => {
    let verifiedNickname = await userService.getNicknameByToken(roomContent.token);
    if(!verifiedNickname) return emitters.createRoomError();

    await userService.removeRoomFromUser(verifiedNickname, roomContent.room);
    socket.leave(roomContent.room);
    emitters.myRoomList(verifiedNickname);
  }

  socket.on("create-room", createRoom);
  socket.on("leave-room", leaveRoom);
}