// JavaScript logic
const queue = [];
let totalNames = 0;
let lastCounter = '';
let lastCalledCustomer = '';

function addToQueue() {
    const customerNameInput = document.getElementById('customerName');
    const customerName = customerNameInput.value.trim();

    if (customerName !== '') {
        queue.push(customerName);
        totalNames++;
        displayQueue();
        displayQueueCount();
        customerNameInput.value = '';
    }
}

function displayQueue() {
    const queueList = document.getElementById('queueList');
    queueList.innerHTML = '';

    for (let i = 0; i < queue.length; i++) {
        const listItem = document.createElement('li');
        listItem.className = 'queue-item';

        const nameElement = document.createElement('div');
        nameElement.className = 'queue-item-name';
        nameElement.textContent = queue[i];
        listItem.appendChild(nameElement);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('data-index', i);
        deleteButton.onclick = removeCustomer;
        listItem.appendChild(deleteButton);

        queueList.appendChild(listItem);
    }
}

function displayQueueCount() {
    const queueCountElement = document.getElementById('queueCount');
    const queueCount = queue.length;
    queueCountElement.textContent = `Queue Count: ${queueCount}`;
}

function removeCustomer(event) {
    const index = event.target.getAttribute('data-index');
    queue.splice(index, 1);
    displayQueue();
    displayQueueCount();
}

function generateCounterMenu() {
    const counterInput = document.getElementById('counterInput');
    const numCounters = parseInt(counterInput.value);

    if (isNaN(numCounters) || numCounters <= 0 || numCounters > 100) {
        alert('Invalid number of counters. Please enter a positive integer between 1 and 100.');
        return;
    }

    const counterMenu = document.getElementById('counterMenu');
    counterMenu.innerHTML = '';

    for (let i = 1; i <= numCounters; i++) {
        const counterButton = document.createElement('button');
        counterButton.className = 'counter-button';
        counterButton.textContent = `Counter ${i}`;
        counterButton.onclick = function () {
            serveCustomer(i);
        };
        counterMenu.appendChild(counterButton);
    }
}

function serveCustomer(counterNumber) {
    if (queue.length > 0) {
        const servedCustomer = queue.shift();
        lastCounter = counterNumber;
        lastCalledCustomer = servedCustomer;
        const voiceText = `${servedCustomer}, silakan menuju Counter ${counterNumber}`;
        speakVoiceNotification(voiceText);
        displayQueue();
        displayQueueCount();
        displayLastCalled();
        document.getElementById('repeatButton').disabled = false;
    } else {
        alert('Queue is empty.');
    }
}

function speakVoiceNotification(text) {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; // Set language code for Indonesian
    utterance.voiceURI = 'Google Bahasa Indonesia'; // Set the voice URI for Indonesian voice

    // Find the Indonesian voice in the available voices
    const voices = speechSynthesis.getVoices();
    const indonesianVoice = voices.find(voice => voice.lang === 'id-ID' && voice.voiceURI === 'Google Bahasa Indonesia');
    if (indonesianVoice) {
        utterance.voice = indonesianVoice;
    }

    speechSynthesis.speak(utterance);

    utterance.onend = function () {
        document.getElementById('repeatButton').disabled = false;
    };
}

function repeatNotification() {
    const voiceText = `${lastCalledCustomer}, silakan menuju Counter ${lastCounter}`;
    speakVoiceNotification(voiceText);
    document.getElementById('repeatButton').disabled = true;
}

function printTotalNames() {
    const printContent = `<div style="font-size: 300px; text-align: center;">${totalNames}</div>`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Printable Document</title>');
    printWindow.document.write('<style>body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; height: 100vh; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function displayLastCalled() {
    const lastCalledElement = document.getElementById('lastCalled');
    lastCalledElement.textContent = `Last Called: ${lastCalledCustomer} (Counter ${lastCounter})`;
}