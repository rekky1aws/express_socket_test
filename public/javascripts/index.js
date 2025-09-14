// CONSTANTS
const socket = io();

// Elts
const mainElt = document.querySelector('main');
const onlineList = document.querySelector('#online-list');
const offlineList = document.querySelector('#offline-list');
const usernameElt = document.querySelector('#username');
const usernameBtn = document.querySelector('#username-btn');
const connElt = document.querySelector('#connexion');
const messageElt = document.querySelector('#message-text');
const sendMsgBtn = document.querySelector('#send-btn');
const msgHistory = document.querySelector('#history');
const onlineCount = document.querySelector('#online-count');
const offlineCount = document.querySelector('#offline-count');
const recoList = document.querySelector('#reco-list');
const pingSound = document.querySelector("#ping-sound");

const possibleModifiers = [ 'Control', 'Alt', 'Shift'];

// VARIABLES
let username;
let lclUsers = {};
let lclMessages = [];
let keyModifiers = [];

// FUNCTIONS
function chgState ()
{
  mainElt.classList.remove('hidden');
  connElt.classList.add('hidden');
}

function checkUsername (username)
{
  const regex = /^[0-9A-Za-z]{6,16}$/;

  lclUsers.online.forEach( (name) => {
    if (name == username) {
      throw new Error(`An user is already connected with this username (${username})`);
    }
  });
  
  if (!username.match(regex)) {
    if (username.length < 6 || username.length > 16) {
      throw new Error("Username must be beetween 6 and 16 characters long.");
    } else {
      throw new Error("Username must follow this pattern : /^[0-9A-Za-z]{6,16}$/");
    }
  }
  
  return true;
}

function displayUser (name, list) {
  // console.log(list); // DEBUG

  const personElt = document.createElement('li');
  personElt.classList.add('person');

  if (name === username) {
    personElt.classList.add('self');
  }

  if (list === recoList) {
    personElt.addEventListener('click', (evt) => {
      usernameElt.value = evt.target.textContent;
      connect();
    });
  }
  personElt.textContent = name;
  list.append(personElt);
}

function connect ()
{
  try {
    checkUsername(usernameElt.value);
    
    username = usernameElt.value;
    chgState();
  
    socket.emit("newUser", username);
  } catch (e) {
    console.warn(e);
  }
}

function clrMsgTxt () {
  messageElt.value = "";
}

function sendMessage ()
{
  if (!messageElt.value.length) {
    throw new Error("Useless to send an empty message.");
  }

  const message = {
    user: username,
    content: messageElt.value,
    datetime: new Date(),
  };

  clrMsgTxt();
  socket.emit('newMessage', message);
}

function displayMessage (message) {
  // console.log(message); // DEBUG

  const messageElt = document.createElement('div');
  const msgContentElt = document.createElement('div');
  const msgDateElt = document.createElement('div');
  const msgSenderElt = document.createElement('div');

  messageElt.classList.add('message');
  msgContentElt.classList.add('msg-content');
  msgDateElt.classList.add('msg-date');
  msgSenderElt.classList.add('msg-sender');

  if (message.user === username) {
    messageElt.classList.add('from-self');
  }

  msgContentElt.textContent = message.content;
  msgSenderElt.textContent = message.user;
  msgDateElt.textContent = new Date(message.datetime).toLocaleString("fr-FR");
  
  messageElt.append(msgDateElt, msgContentElt, msgSenderElt);
  msgHistory.append(messageElt);
}

function messageHandler (evt) {
  // Key Modifiers
  if (possibleModifiers.includes(evt.key)) {
    keyModHandler(evt);
    return false;
  }

  // Not caring for keyup if it isn't a modifier.
  if (evt.type == 'keyup') {
    return false;
  }

  switch(evt.key) {
    case 'Enter':
      evt.preventDefault();
      if (!keyModifiers.includes('Control')) {
        sendMessage();
      } else {
        messageElt.value = messageElt.value + "\n";
      }
      break;
  }
}

function keyModHandler (evt) {
  // Adding key on keydown
  if (evt.type == 'keydown') {
    const keyModIndex = keyModifiers.includes(evt.key);
    if (!keyModifiers.includes(evt.key)) {
      keyModifiers.push(evt.key);
    } 
  }

  // Removing key on keyup
  if (evt.type == 'keyup') {
    const keyModIndex = keyModifiers.indexOf(evt.key);
    if (keyModIndex != -1) {
      keyModifiers.splice(keyModIndex, 1);
    } 
  }

  console.log(keyModifiers);
}

async function playPingSound () {
  pingSound.play();
}

// EVENT LISTENERS
usernameBtn.addEventListener('click', connect);
sendMsgBtn.addEventListener('click', sendMessage);
messageElt.addEventListener('keydown', messageHandler);
messageElt.addEventListener('keyup', messageHandler);

// MAIN
socket.on('updateUsers', (users) => {
  console.group('updateUsers');
  
    // Resetting the corresponding divs
    onlineList.innerHTML = "";
    offlineList.innerHTML = "";
    recoList.innerHTML = "";

  // Getting user and sorting them in alphabetical order
  lclUsers = {
    online: [],
    offline: []
  };

  for (const id in users.online) {
    lclUsers.online.push(users.online[id].name);
  }

  for (const id in users.offline) {
    if (users.offline[id].name) {
      lclUsers.offline.push(users.offline[id].name);
    }
  }

  lclUsers.online.sort();
  lclUsers.offline.sort();
  
  console.log(lclUsers); // DEBUG

  // Displaying users in corresponding lists
  lclUsers.online.forEach((username) => {
    displayUser(username, onlineList);
  });

  lclUsers.offline.forEach((username) => {
      displayUser(username, recoList);
      displayUser(username, offlineList);
  });

  // console.log(onlineList); // DEBUG

  onlineCount.textContent = Object.entries(lclUsers.online).length;
  offlineCount.textContent = Object.entries(lclUsers.offline).length;

  console.groupEnd('updateUsers');
});

socket.on('updateMessages', (messages) => {
  // Do nothing if there's no new message
  if(messages.length === lclMessages.length) {
    return false;
  }

  // Dislaying messages
  for (let i=lclMessages.length; i<messages.length; i++) {
    // console.log(messages[i]); // DEBUG
    displayMessage(messages[i]);
  }

  lclMessages = messages;

  // Playing sound
  if (lclMessages[lclMessages.length - 1].user != username)
  playPingSound();
  
});