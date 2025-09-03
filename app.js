const express = require('express');
const app = express();

// Socket.io setup
const http = require('http');
const { platform } = require('os');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {
  online: {},
  offline: {}
};
const messages = [];

io.on('connection', (socket) => {
  console.log('a user has connected');
  
  // Sending users
  socket.emit('updateMessages', messages);
  socket.emit('updatePeople', users); // Emit to only the person who just connected
  // io.emit('updateUsers', users); // Emit to everyone
  
  // Listening to events emitted by clients
  socket.on('newUser', (username) => {
    // Deleting user from offline list if present
    for (const [userId, userData] of Object.entries(users.offline)) {
      if (userData.name === username) {
        delete users.offline[userId];
      }
    }
    
    // Adding user
    users.online[socket.id] = {
      name: username,
    }
    
    io.emit('updateUsers', users);
  });
  
  socket.on('disconnect', (reason) => {
    // console.log(`An user has disconnected (${users.online[socket.id].name}) for this reason : ${reason}`); // DEBUG
    
    users.offline[socket.id] = users.online[socket.id];
    delete users.online[socket.id];
    
    io.emit('updateUsers', users);
  });
  
  socket.on('newMessage', (message) => {
    messages.push(message);
    
    console.log(messages); // DBEUG
    
    io.emit('updateMessages', messages);
  });
});

server.listen(port, () => {
  console.log(`Example app running on port : ${port}`); // DEBUG
});