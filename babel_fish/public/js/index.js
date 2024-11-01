
const ws = new WebSocket(`ws://${window.document.location.host}`);
// Log socket opening and closing
ws.addEventListener("open", event => {
    console.log("Websocket connection opened");
});

ws.addEventListener("close", event => {
    console.log("Websocket connection closed");
});

ws.onmessage = function (message) {
    /* 
    // what we're expecting from the server will send us 
    // when a new msg is received from a client and it forwards the message
    {
        "user": "Little Bobby Tables",
        "action": "send_message",
        "msg": "Have a nice day!"
    }
    */

    const msg = JSON.parse(message.data);

    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msgCtn');
    
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
    
    document.getElementById('messages').appendChild(msgDiv);

    const speakButton = document.createElement('button');
    speakButton.textContent = 'Speak';
    speakButton.classList.add('speakButton'); // Use class instead of id
    speakButton.setAttribute('data-message', fullMessage); // Store the message in a data attribute
    msgDiv.appendChild(speakButton); // Attach the button to the message div

    // Event delegation for speak buttons
    document.getElementById('messages').addEventListener('click', (event) => {
        if (event.target.classList.contains('speakButton')) {
            const messageText = event.target.getAttribute('data-message');
            if (messageText) {
                const message = new SpeechSynthesisUtterance(messageText);
                window.speechSynthesis.speak(message);
            } else {
                console.error('No text to speak');
            }
        }
    });

}
const form = document.getElementById('msgForm');

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

function login(event) {
    // send login message
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
}

document.addEventListener('DOMContentLoaded', () => {
    // Speach to text
    const recordButton = document.getElementById('recordButton');
    const transcriptDiv = document.getElementById('inputBox');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        transcriptDiv.textContent = transcript;
    };

    recordButton.addEventListener('click', () => {
        recognition.start();
    });
});