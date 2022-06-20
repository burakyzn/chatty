const userController = require('../../controllers/user');

module.exports = (io, socket) => {
  const onlineUsers = () => {
    let onlineUsers = userController.getOnlineUsers();
    io.emit('online-users', [...onlineUsers]);
  }

  const offlineUsers = async () => {
    let offlineUsers = await userController.getOfflineUsers();
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