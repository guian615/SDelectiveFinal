const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const townName = document.getElementById('town-name');
const userList = document.getElementById('users');
const anchorName = document.getElementById('anchorname');
const spanName = document.getElementById('spanName');

// Get username and room from URL
const { username, town } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

$('.msg').keyup(() => {
    socket.emit("nagtypeba", {
        name: username,
        typing: $('.msg').val().length > 0

    })
})

socket.on("nagtypeba", (data) => {
    $('.typing').html(data.typing ? `${data.name} is typing...` : '')
})

// Join chatroom
socket.emit('joinTown', { username, town });

socket.on('user', (user) => {
        anchorName.innerText = user;
        spanName.innerText = user;
    })
    // Get room and users
socket.on('townUsers', ({ town, users }) => {
    outputTownName(town);
    outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {

    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;

    if (message.username == username) {
        div.classList.add('user');
    } else {

    }
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputTownName(town) {
    townName.innerText = town;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveTown = confirm('Are you sure you want to leave the chatroom?');
    if (leaveTown) {
        window.location = '../index.html';
    } else {}
});