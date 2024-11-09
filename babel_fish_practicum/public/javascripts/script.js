'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Speach to text
    const recordButton = document.getElementById('recordButton');
    const transcriptDiv = document.getElementById('transcript');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        transcriptDiv.textContent = transcript;
    };

    recordButton.addEventListener('click', () => {
        recognition.start();
    });

    // Text to speech
    const speakButton = document.getElementById('speakButton');
    const translation = document.getElementById('translation');

    speakButton.addEventListener('click', () => {
        const messageText = translation.textContent;
        if (messageText) {
            // Stop any ongoing speech synthesis
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
            const message = new SpeechSynthesisUtterance(messageText);
            window.speechSynthesis.speak(message);
        } else {
            console.error('No text to speak');
        }
    });

    // Translation
    const translateButton = document.getElementById('translateButton');
    const translationDiv = document.getElementById('translation');

    translateButton.addEventListener('click', async () => {

        const response = await fetch("https://translation.googleapis.com/language/translate/v2?key=AIzaSyDdDpwBK_ssJRH9-hqRkhHqzSA0fzg8tvc", {
            method: "POST",
            body: JSON.stringify({ "q": transcriptDiv.textContent, "target": "es" }),
        });

        const respData = await response.json();
        console.log(respData.data.translations);
        const translatedMessage = respData.data.translations[0].translatedText;
        translationDiv.textContent = translatedMessage;
    });
});

// Websockets
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
    console.log('Connected to the server');
};

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Received message:', message);
};

ws.onclose = () => {
    console.log('Disconnected from the server');
};

ws.onerror = (error) => {
    console.error('Error:', error);
};

// const ws = new WebSocket(`ws://${window.document.location.host}`);
//         ws.binaryType = "blob";
//         // Log socket opening and closing
//         ws.addEventListener("open", event => {
//             console.log("Websocket connection opened");
//         });
//         ws.addEventListener("close", event => {
//             console.log("Websocket connection closed");
//         });
//         ws.onmessage = function (message) {
//             const msgDiv = document.createElement('div');
//             msgDiv.classList.add('msgCtn');
//             if (message.data instanceof Blob) {
//                 reader = new FileReader();
//                 reader.onload = () => {
//                     msgDiv.innerHTML = reader.result;
//                     document.getElementById('messages').appendChild(msgDiv);
//                 };
//                 reader.readAsText(message.data);
//             } else {
//                 console.log("Result2: " + message.data);
//                 msgDiv.innerHTML = message.data;
//                 document.getElementById('messages').appendChild(msgDiv);
//             }
//         }
//         const form = document.getElementById('msgForm');
//         form.addEventListener('submit', (event) => {
//             event.preventDefault();
//             const message = document.getElementById('inputBox').value;
//             ws.send(message);
//             document.getElementById('inputBox').value = ''
//         })

// Send message
const sendButton = document.getElementById('sendButton');