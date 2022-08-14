const userService = require('../../services/userService');

module.exports = (io, socket) => {
  const createRoomError = (message) => {
    socket.emit("create-room-error", message);
  }

  const createRoomSuccess = () => {
    socket.emit("create-room-success", "You created a new room successfully!")
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
    createRoomSuccess,
    myRoomList,
    joinRooms
  }
}