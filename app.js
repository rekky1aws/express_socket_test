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
const messages = [];

io.on('connection', (socket) => {
  console.log('a user has connected');

  // Sending users
  socket.emit('updateMessages', messages);
  // io.emit('updateUsers', users); // Emit to everyone
  socket.emit('updatePeople', users); // Emit to only the person who just connected

  // Listening to events emitted by clients
  socket.on('newUser', (username) => {
    users[socket.id] = {
      name: username,
    }

    io.emit('updateUsers', users);
  });
  
  socket.on('newMessage', (message) => {
    messages.push(message);

    console.log(messages);

    io.emit('updateMessages', messages);
  });
});

server.listen(port, () => {
  console.log(`Example app running on port : ${port}`);
});