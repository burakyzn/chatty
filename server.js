const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = require("socket.io")(server, {
  cors: {
    origin: (process.env.APP_NAME || "http://localhost:3000"),
    methods : ["GET","POST"]
  }
});

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));
}

app.get('/api', (req,res) =>{
  const testres = {
    text : "selam!"
  }
  res.json(testres);
})

var users = [];

io.on('connection', (socket) => {
  console.log('Yeni kullanici giris yapti. Socket id : ' + socket.id);
  io.to(socket.id).emit('chat message', 'Chat sistemine hoşgeldin.');
  socket.on('newuser', nickname => {
    users.push({
      "socketID" : socket.id,
      "nickname" : nickname
    })

    io.emit('onlineusers', {"userList" : [...users]});
    io.to(socket.id).emit('chat message','Kullanici adini ' + nickname + ' olarak belirledin.')

    socket.once('disconnect', ()=>{
      users = users.filter(user => user.socketID != socket.id);
      console.log('Kullanici ayrildi. Socket id : ' + socket.id);
      io.emit('onlineusers', {"userList" : [...users]});
    })

    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });
});

server.listen(PORT, console.log(`Server is starting at ${PORT}`));