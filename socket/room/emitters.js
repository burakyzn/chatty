const userService = require('../../services/userService');

module.exports = (io, socket) => {
  const createRoomError = () => {
    socket.emit("create-room-error", "unauthorized-token");
  }
  
  const myRoomList = async (nickname) => {
    let roomList = await userService.getRoomListOfUser(nickname);
    socket.emit("my-room-list", roomList);
  }

  const joinRooms = async (nickname) => {
    let roomList = await userService.getRoomListOfUser(nickname);
    for await (const roomName of roomList) {
      socket.join(roomName);
    }
  }

  return {
    createRoomError,
    myRoomList,
    joinRooms
  }
}