const path = require('path');
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;
const cors = require('cors');
const routes = require('./routes');
const socket = require('./socket');
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.APP_NAME || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// configure the app to use bodyParser()
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get(['/register', '/login', '/home'], function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.use('/', routes);

socket.listen(io);
server.listen(PORT, console.log(`Server is starting at ${PORT}`));
