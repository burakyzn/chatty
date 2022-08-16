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

  return {
    onlineUsers,
    offlineUsers
  }
}