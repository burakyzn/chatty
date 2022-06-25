const userService = require('../../services/userService');

module.exports = (io, socket) => {
  const onlineUsers = () => {
    let onlineUsers = userService.getOnlineUsers();
    io.emit('online-users', [...onlineUsers]);
  }

  const offlineUsers = async () => {
    let offlineUsers = await userService.getOfflineUsers();
    io.emit('offline-users', [...offlineUsers]);
  }

  const newUserError = () => {
    socket.emit("new-user-error", "unauthorized-token");
  }

  return {
    onlineUsers,
    offlineUsers,
    newUserError
  }
}