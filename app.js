const express = require('express');
const app = express();

// Socket.io setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
  console.log('a user has connected');

  // Listening to event emitted by client
  socket.on('newUser', (username) => {
    users[socket.id] = {
      name: username,
    }
    console.log(users);

    io.emit('updateUsers', users);
  });
  
  io.emit('updateUsers', users); // Emit to everyone
  // socket.emit('updatePeople', people); // Emit to only the person who just connected
    
});

server.listen(port, () => {
  console.log(`Example app running on port : ${port}`);
});