const userService = require('../../services/userService');
const chatService = require('../../services/chatService');

module.exports = (io, socket) => {
  const emitters = require("./emitters")(io, socket);

  const createRoom = async (roomContent) => {
    let verifiedNickname = await userService.getNicknameByToken(roomContent.token);
    if(!verifiedNickname) return emitters.createRoomError("User could not be verified!");

    let roomExist = await chatService.roomExist(roomContent.name);
    console.log("roomExists", roomExist);

    if(roomExist)
      return emitters.createRoomError("A room with the same name already exists!");
      
    socket.join(roomContent.name);
    await userService.addRoomToUsers([verifiedNickname, ...roomContent.nicknames], roomContent.name);
    await emitters.myRoomList(verifiedNickname);
    chatService.createRoom(roomContent.name, roomContent.nicknames.length);
    emitters.createRoomSuccess();
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