const registerUserListeners = require("./user/listeners");

const listen = (io) => {
  const onConnection = (socket) => {
    registerUserListeners(io, socket);
  }

  io.on("connection", onConnection);
};

module.exports = {
  listen
}