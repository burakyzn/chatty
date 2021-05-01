const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var users = [];
var nicknames = [];

io.on('connection', (socket) => {
  io.to(socket.id).emit('chat message', {"user": "system", "text" : 'Chat sistemine hoşgeldin.'});

  socket.on('newuser', function (name) {
    if(nicknames.indexOf(name) == -1){
      users[socket.id] = name;
      nicknames.push(name);
      io.to(socket.id).emit('chat message',{"user": "system", "text" : 'Kullanıcı adını ' + name + ' olarak belirledin.'})
      io.emit('onlineusers', {...users});
    } else {
      io.to(socket.id).emit('nicknameerror',{"user": "system", "text" : 'Bu kullanıcı adı daha once secilmis!'})
    }

    socket.once('disconnect', function () {
      io.emit('chat message', {"user": "system", "text" : users[socket.id]+ " ayrıldı."});
      delete nicknames[nicknames.indexOf(users[socket.id])];
      delete users[socket.id];
      io.emit('onlineusers', {...users});
    });

    socket.on('chat message', (msg) => {
      io.emit('chat message', {"user" : users[socket.id], "text": msg});
    });
  });
});

server.listen(PORT, () => console.log(`Listening on ${ PORT }`))