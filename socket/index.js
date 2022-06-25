const registerUserListeners = require("./user/listeners");
const registerChatListeners = require('./chat/listeners');

const listen = (io) => {
  const onConnection = (socket) => {
    registerUserListeners(io, socket);
    registerChatListeners(io, socket);
  }

  io.on("connection", onConnection);
};

module.exports = {
  listen
}