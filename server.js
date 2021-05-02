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

io.on('connection', (socket) => {
  console.log('Yeni kullanici giris yapti. Socket id : ' + socket.id);

  socket.once('disconnect', ()=>{
    console.log('Kullanici ayrildi. Socket id : ' + socket.id);
  })
});

server.listen(PORT, console.log(`Server is starting at ${PORT}`));