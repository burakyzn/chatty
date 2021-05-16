const path = require('path');
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const routes = require('./routes/index');
const socket = require('./socket/index');
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use('/', routes);

socket.listeners(io);

server.listen(PORT, console.log(`Server is starting at ${PORT}`));
