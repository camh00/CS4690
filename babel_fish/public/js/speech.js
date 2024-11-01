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
            const message = new SpeechSynthesisUtterance(messageText);
            window.speechSynthesis.speak(message);
        } else {
            console.error('No text to speak');
        }
    });
});