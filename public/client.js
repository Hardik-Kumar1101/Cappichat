const socket = io();

const body = document.querySelector('.container');
const chatBox = document.getElementById('chatContainer');
const onUsers = document.getElementById('onUsers');
const messageContainer = document.getElementById('chatting')
const form = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');

const formnames = document.getElementById('formnames');
const username = document.getElementById('username');
const roomId = document.getElementById('roomId');
const userid = document.getElementById('userId');

const audio = new Audio('./public_effect.mp3');




// const name = prompt('Enter your name to Join');
function closeForm(id) {
    document.querySelector('.container').style.display = "block";
    document.getElementById("myForm").style.display = "none";
    userid.innerHTML = id;
    }

function fun(id) {
        if (confirm("For Entering in chat click yes")) {
            closeForm(id);
        }
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }


formnames.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = username.value;
    const id = roomId.value;

    if (message == "" || message.length <= 3 || id == "") {
        const h1Element = document.createElement('h1');
        h1Element.classList.add('noAccess');
        h1Element.innerText = 'Sorry, You are not Allowed to access the chat 💬👋';
        chatBox.remove();
        body.append(h1Element);
        alert('Access Denied');
    } else {
        fun(id);
        socket.emit('new-user-joined', message)
    }

})


socket.on('userIncrement', data => {
    onUsers.innerText = data
})

const appendAction = (message, position) => {
    const messageElement = document.createElement('div');
    const timing = document.createElement('span');
    const pElement = document.createElement('p');
    pElement.innerText = message;
    timing.innerHTML = `${formatAMPM(new Date)}`
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageElement.append(pElement);
    messageElement.append(timing)
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const appendMessage = (message, user, position, id) => {
    const messageElement = document.createElement('div');
    const span = document.createElement('span');
    const timing = document.createElement('span');
    const i = document.createElement('i');
    const p = document.createElement('p');
    i.classList.add('fa-solid');
    i.classList.add('fa-heart');
    p.innerText = message;
    span.innerText = user;
    timing.innerHTML = `${formatAMPM(new Date)}`
    messageElement.append(span)
    messageElement.append(i)
    messageElement.append(p);
    messageElement.append(timing)
    messageElement.classList.add(position)
    messageElement.classList.add('message') 
    messageElement.setAttribute('id', id)
    messageElement.setAttribute('ondblclick', "likedMessage(this.id)");
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;

}

socket.on('user-joined', data => {
    appendAction(`${data.name} Joined the Chat`, 'center')
    onUsers.innerText = data.onUsers
})

socket.on('receive',data =>{
    appendMessage(data.message,data.name,'left',data.id)
    audio.play();
})

const likedMessage = (id)=>{
    const likedElement = document.getElementById(id);
    likedElement.classList.add('liked');
    socket.emit('liked',id)
}

socket.on('msg-like',id =>{
    const likedElement = document.getElementById(id);
    likedElement.classList.add('liked');
})

socket.on('disconnected',data =>{
    appendAction(`${data.name} left the Chat`,'center')
    onUsers.innerHTML = data.onUsers
})


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    messageInput.value = '';
    if (message === "") {
        return
    }
    messageInput.value = "";
    const id  = userid;
    console.log(userid)
    appendMessage(message, 'You', 'right', id);
    socket.emit('send', { message, id})

    
    
})


