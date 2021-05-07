const path = require('path');
const userController = require('./controllers/user'); 
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const routes = require('./routes/index');
const io = require("socket.io")(server, {
  cors: {
    origin: (process.env.APP_NAME || "http://localhost:3000"),
    methods : ["GET","POST"]
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

var users = [];
var images = [];
images[0] = "https://www.w3schools.com/howto/img_avatar.png";
images[1] = "https://www.w3schools.com/howto/img_avatar2.png";
images[2] = "https://www.w3schools.com/w3images/avatar2.png";
images[3] = "https://www.w3schools.com/w3images/avatar6.png";
images[4] = "https://www.w3schools.com/w3images/avatar5.png";

app.use(cors());

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));
}

app.use("/", routes);

io.on('connection', (socket) => {
  console.log('Yeni kullanici giris yapti. Socket id : ' + socket.id);

  var sysContent = {
    nickname : '',
    color : '#000',
    system : true,
    msg : ''
  }

  sysContent.msg = 'Chat sistemine hoşgeldin.';
  io.to(socket.id).emit('chat message', sysContent);
  socket.on('newuser', nickname => {
    users.push({
      "socketID" : socket.id,
      "nickname" : nickname,
      "color" : getRandomColor(),
      "avatar" : null //images[Math.floor(Math.random() * 5)]
    })

    io.emit('onlineusers', {"userList" : [...users]});

    sysContent.msg = 'Kullanıcı adını ' + nickname + ' olarak belirledin.';
    io.to(socket.id).emit('chat message', sysContent);

    socket.once('disconnect', ()=>{
      var user = users.find(user => user.socketID == socket.id);
      sysContent.msg = user.nickname + ' sohbetten ayrıldı.';

      users = users.filter(user => user.socketID != socket.id);

      io.emit('chat message', sysContent);
      console.log('Kullanici ayrildi. Socket id : ' + socket.id);
      io.emit('onlineusers', {"userList" : [...users]});
    })
    
    socket.on('chat message', (msg) => {
      var user = users.find(user => user.socketID == socket.id);
      var content = {
        nickname : user.nickname,
        color : user.color,
        avatar : userController.avatars[user.nickname] === undefined ? user.avatar : userController.avatars[user.nickname],
        system : false,
        msg : msg
      }
      
      io.emit('chat message', content);
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

server.listen(PORT, console.log(`Server is starting at ${PORT}`));