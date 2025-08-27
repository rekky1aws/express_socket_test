// Socket
const socket = io();
console.log(socket);

const peopleList = document.querySelector('#people-list');

socket.on('updatePeople', (people) => {
  peopleList.innerHTML = "";

  for (const id in people) {
    const personElt = document.createElement('div');
    personElt.classList.add('person');
    personElt.textContent = people[id].name;
    peopleList.append(personElt);
  }
  
  console.log(people);
});