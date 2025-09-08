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

// VARIABLES
let username;
let lclUsers = {};
let lclMessages = [];

// FUNCTIONS
function chgState ()
{
  mainElt.classList.remove('hidden');
  connElt.classList.add('hidden');
}

function checkUsername (username)
{
  const regex = /^[0-9A-Za-z]{6,16}$/;

  for (const id in lclUsers) {
    if (lclUsers[id].name == username) {
      throw new Error(`An user already have this username (${username})`);
    }
  }
  
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

// EVENT LISTENERS
usernameBtn.addEventListener('click', connect);
sendMsgBtn.addEventListener('click', sendMessage);

// MAIN
socket.on('updateUsers', (users) => {
  lclUsers = users;
  onlineList.innerHTML = "";
  offlineList.innerHTML = "";
  
  for (const id in lclUsers.online) {
    displayUser(lclUsers.online[id].name, onlineList);
  }

  for (const id in lclUsers.offline) {
    displayUser(lclUsers.offline[id].name, offlineList);
  }

  console.log(onlineList);

  onlineCount.textContent = Object.entries(lclUsers.online).length;
  offlineCount.textContent = Object.entries(lclUsers.offline).length;
});

socket.on('updateMessages', (messages) => {
  if(messages.length === lclMessages.length) {
    return false;
  }
  for (let i=lclMessages.length; i<messages.length; i++) {
    // console.log(messages[i]); // DEBUG
    displayMessage(messages[i]);
  }
  lclMessages = messages;
});