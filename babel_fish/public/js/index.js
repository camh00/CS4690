// Cameron Hancock
// CS 4690
'use strict';
const ws = new WebSocket(`ws://${window.document.location.host}`);
// Log socket opening and closing
ws.addEventListener("open", event => {
    console.log("Websocket connection opened");
});

ws.addEventListener("close", event => {
    console.log("Websocket connection closed");
});

ws.onmessage = function (message) {

    const msg = JSON.parse(message.data);

    const msgDiv = document.createElement('div');
    msgDiv.classList.add('border', 'border-primary', 'rounded', 'p-2', 'mb-2');
    
    // Display message
    let fullMessage;
    if (msg.action == "login")
    {       
        fullMessage = `${msg.user} logged in.`;
        msgDiv.innerHTML = fullMessage;
    }
    else
    {
        fullMessage = `${msg.user} said, \"${msg.msg}\"`;
        msgDiv.innerHTML = fullMessage;
        
    }
    document.getElementById('messages').appendChild(msgDiv);
    
    // Speak button
    const speakButton = document.createElement('button');
    speakButton.textContent = 'Speak';
    speakButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'm-4');
    speakButton.setAttribute('data-message', fullMessage);
    speakButton.setAttribute('onclick', `speakMessage('${fullMessage.replace(/'/g, "\\'")}')`);
    msgDiv.appendChild(speakButton);

}

// Speak button function
function speakMessage(messageText) {
    if (messageText) {
        const message = new SpeechSynthesisUtterance(messageText);
        window.speechSynthesis.speak(message);
    } else {
        console.error('No text to speak');
    }
}
const form = document.getElementById('msgForm');

// Send message
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const messageText = document.getElementById('inputBox').value;
    const lang = document.getElementById('lang').value;
    const msg =  {
        "msg_type": "msg",
        "msg": messageText,
        "lang_from": lang,
        "translations" : { }
    }

    ws.send(JSON.stringify(msg));
    document.getElementById('inputBox').value = ''
})

// send login message
function login(event) {
    const user_name = document.getElementById('username').value;
    document.getElementById('username').readonly = "readonly";
    const lang = document.getElementById('lang').value;
    document.getElementById('lang').readonly = "readonly";

    const login_msg =  {
        "msg_type": "login",
        "lang": lang,
        "user": user_name
    }
    
    ws.send(JSON.stringify(login_msg));

    // Hide login form and show message form
    document.getElementById('loginForm').classList.add('d-none');
    document.getElementById('msgForm').classList.remove('d-none');
    document.getElementById('msgSection').classList.remove('d-none');

}

// Speach to text
document.addEventListener('DOMContentLoaded', () => {
    const recordButton = document.getElementById('recordButton');
    const transcriptDiv = document.getElementById('inputBox');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        transcriptDiv.value = transcript;
    };

    recordButton.addEventListener('click', () => {
        recognition.start();
    });
});