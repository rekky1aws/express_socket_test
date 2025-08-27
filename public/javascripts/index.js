// CONSTANTS
const socket = io();

// Elts
const peopleList = document.querySelector('#people-list');
const usernameElt = document.querySelector('#username');
const usernameBtn = document.querySelector('#username-btn');
const connElt = document.querySelector('#connexion');
const mainElt = document.querySelector('main'); 

// VARIABLES
let username;
let localUsers = {};

// FUNCTIONS
function chgState ()
{
  mainElt.classList.remove('hidden');
  connElt.classList.add('hidden');
}

function checkUsername (username)
{
  const regex = /^[0-9A-Za-z]{6,16}$/;

  for (const id in localUsers) {
    if (localUsers[id].name == username) {
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

// EVENT LISTENERS
usernameBtn.addEventListener('click', connect);

// MAIN
socket.on('updateUsers', (users) => {
  localUsers = users;
  peopleList.innerHTML = "";
  
  for (const id in users) {
    createPersonInList(users[id].name)
  }
});