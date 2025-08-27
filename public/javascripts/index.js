// CONSTANTS
const socket = io();

// Elts
const mainElt = document.querySelector('main');
const peopleList = document.querySelector('#people-list');
const usernameElt = document.querySelector('#username');
const usernameBtn = document.querySelector('#username-btn');
const connElt = document.querySelector('#connexion');
const messageElt = document.querySelector('#message-text');
const sendMsgBtn = document.querySelector('#send-btn');
const msgHistory = document.querySelector('#history');

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

function createPersonInList (name) {
  const personElt = document.createElement('div');
  personElt.classList.add('person');
  personElt.textContent = name;
  peopleList.append(personElt);
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
  peopleList.innerHTML = "";
  
  for (const id in users) {
    createPersonInList(users[id].name);
  }
});

socket.on('updateMessages', (messages) => {
  messages.forEach(message => {
    if (!lclMessages.includes(message)) {
      displayMessage(message);
      lclMessages.push(message);
    }
  });
});