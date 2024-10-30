
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
    
    if (msg.action == "login")
    {       
        msgDiv.innerHTML = `${msg.user} logged in.`;
    }
    else
    {
        msgDiv.innerHTML = `${msg.user} said, \"${msg.msg}\"`;
    }
    document.getElementById('messages').appendChild(msgDiv);
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