module.exports = (io, socket) => {
  const createRoomError = () => {
    socket.emit("create-room-error", "unauthorized-token");
  }

  return {
    createRoomError
  }
}