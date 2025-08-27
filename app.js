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

const people = {};

io.on('connection', (socket) => {
  console.log('a user has connected');
  people[socket.id] = {
    name: `Test ${socket.id}`,
  }
  
  io.emit('updatePeople', people); // Emit to everyone
  // socket.emit('updatePeople', people); // Emit to only the person who just connected
  
  
  console.log(people);
});

server.listen(port, () => {
  console.log(`Example app running on port : ${port}`);
});