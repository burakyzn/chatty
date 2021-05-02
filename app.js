const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 5000;

app.use('/public', express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var users = [];
var nicknames = [];

var images = [];
images[0] = "https://www.w3schools.com/howto/img_avatar.png";
images[1] = "https://www.w3schools.com/howto/img_avatar2.png";
images[2] = "https://www.w3schools.com/w3images/avatar2.png";
images[3] = "https://www.w3schools.com/w3images/avatar6.png";
images[4] = "https://www.w3schools.com/w3images/avatar5.png";


io.on('connection', (socket) => {
  io.to(socket.id).emit('chat message', {"user": "system", "text" : 'Chat sistemine hoşgeldin.'});

  socket.on('newuser', function (name) {
    if(nicknames.indexOf(name) == -1){
      users[socket.id] = {
        nickname : name,
        color : getRandomColor(),
        avatar : images[Math.floor(Math.random() * 5)]
      }
      nicknames.push(name);
      io.to(socket.id).emit('chat message',{"user": "system", "text" : 'Kullanıcı adını ' + name + ' olarak belirledin.'})
      io.emit('onlineusers', {...nicknames});
    } else {
      io.to(socket.id).emit('nicknameerror',{"user": "system", "text" : 'Bu kullanıcı adı daha once secilmis!'})
    }

    socket.once('disconnect', function () {
      io.emit('chat message', {"user": "system", "text" : users[socket.id].nickname + " ayrıldı."});
      delete nicknames[nicknames.indexOf(users[socket.id].nickname)];
      delete users[socket.id];
      io.emit('onlineusers', {...nicknames});
    });

    socket.on('chat message', (msg) => {
      io.emit('chat message', {"user" : users[socket.id], "text": msg});
    });
  });
});

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

server.listen(PORT, () => console.log(`Listening on ${ PORT }`))