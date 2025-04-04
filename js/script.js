const phoneticSounds = {
    vowels: {
        "æ": "sounds/sound_æ.mp3",
        "ɔ": "sounds/sound_ɔ.mp3",
        "a": "sounds/sound_a.mp3",
        "ei": "sounds/sound_ei.mp3",
        "ii": "sounds/sound_ii.mp3",
        "e": "sounds/sound_e.mp3",
        "ai": "sounds/sound_ai.mp3",
        "o": "sounds/sound_o.mp3",
        "u": "sounds/sound_u.mp3",
        "ɘ": "sounds/sound_ɘ.mp3",
        "au": "sounds/sound_au.mp3",
        "ʊ": "sounds/sound_ʊ.mp3",
        "oi": "sounds/sound_oi.mp3",
        "ɝ": "sounds/sound_ɜ.mp3",
        "eɜ": "sounds/sound_eɜ.mp3",
        "iɜ": "sounds/sound_iɜ.mp3",
        "aɝ": "sounds/sound_aɝ.mp3",
        "ɔɝ": "sounds/sound_ɔɝ.mp3",
        "ju": "sounds/sound_ju.mp3",
        "i": "sounds/sound_i.mp3"
    },
    consonants: {
        "b": "sounds/sound_b.mp3",
        "p": "sounds/sound_p.mp3",
        "d": "sounds/sound_d.mp3",
        "f": "sounds/sound_f.mp3",
        "v": "sounds/sound_v.mp3",
        "g": "sounds/sound_g.mp3",
        "k": "sounds/sound_k.mp3",
        "h": "sounds/sound_h.mp3",
        "l": "sounds/sound_l.mp3",
        "m": "sounds/sound_m.mp3",
        "n": "sounds/sound_n.mp3",
        "θ": "sounds/sound_θ.mp3",
        "ð": "sounds/sound_ð.mp3",
        "s": "sounds/sound_s.mp3",
        "z": "sounds/sound_z.mp3",
        "r": "sounds/sound_r.mp3",
        "j": "sounds/sound_j.mp3",
        "t": "sounds/sound_t.mp3",
        "w": "sounds/sound_w.mp3",
        "ŋ": "sounds/sound_ŋ.mp3",
        "ʃ": "sounds/sound_ʃ.mp3",
        "tʃ": "sounds/sound_tʃ.mp3",
        "Ʒ": "sounds/sound_Ʒ.mp3",
        "ʤ": "sounds/sound_ʤ.mp3"
    }
};
// Enable dragging on buttons
function enableDragAndDrop(button) {
    button.setAttribute('draggable', true);
    button.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', e.target.dataset.soundFile);
        e.dataTransfer.setData('symbol', e.target.textContent);
    });
}

// Handle drop event
function handleDrop(event) {
    event.preventDefault();
    const soundFile = event.dataTransfer.getData('text');
    const symbol = event.dataTransfer.getData('symbol');
    if (soundFile && symbol) {
        const droppedButton = document.createElement('button');
        droppedButton.textContent = symbol;
        droppedButton.dataset.soundFile = soundFile;
        droppedButton.className = 'chart-button';
        document.getElementById('follow-along').appendChild(droppedButton);
    }
}

// Allow drop event
function allowDrop(event) {
    event.preventDefault();
}
let isPlaying = false;

// Function to play a sound
function playSound(filePath) {
    console.log(`DEBUG: Attempting to play sound from: ${filePath}`);
    const audio = new Audio(filePath);
    return audio.play().then(() => {
        console.log(`DEBUG: Playing sound from: ${filePath}`);
    }).catch((error) => {
        console.error(`ERROR: Could not play sound: ${filePath}`, error);
        alert(`Failed to play sound from ${filePath}. Please check the file.`);
    });
}

// Function to get and welcome the user
function getUserName() {
    const name = prompt("Please enter your name:");
    if (name) welcomeUser(name);
}

// Function to welcome the user
function welcomeUser(name) {
    const welcomeMessage = `Welcome, ${name}! Enjoy your interactive phonetic chart.`;
    const utterance = new SpeechSynthesisUtterance(welcomeMessage);
    utterance.pitch = 1.2;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
}

// Function to create a phonetic button
function createButton(symbol, soundFile, container) {
    const button = document.createElement('div');
    button.className = 'chart-button';
    button.textContent = `/${symbol}/`;
    button.dataset.soundFile = soundFile;
    button.onclick = () => handleButtonClick(button, soundFile);
    enableDragAndDrop(button); // Enable drag and drop
    container.appendChild(button);
}

// Handle button clicks
function handleButtonClick(button, soundFile) {
    playSound(soundFile);
    button.classList.add('highlighted');
    const clone = button.cloneNode(true);
    clone.dataset.soundFile = soundFile;
    clone.classList.remove('highlighted');
    document.getElementById('follow-along').appendChild(clone);
}

// Clear Follow Along Chart
function clearFollowAlong() {
    const followAlongDiv = document.getElementById('follow-along');
    if (followAlongDiv) {
        followAlongDiv.innerHTML = '<button onclick="playSelectedSounds()">Play Selected Sounds</button>';
    }
}

// Clear Highlighted Buttons
function clearHighlightedButtons() {
    const buttons = document.querySelectorAll('.chart-button');
    buttons.forEach(btn => btn.classList.remove('highlighted'));
}

// Play selected sounds with a delay
async function playSelectedSounds() {
    if (isPlaying) return;
    isPlaying = true;
    const buttons = document.querySelectorAll('#follow-along .chart-button');
    for (const button of buttons) {
        const soundFile = button.dataset.soundFile;
        await playSound(soundFile);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    isPlaying = false;
}

// Add Space to Follow Along Chart
function addSpace() {
    const spaceElement = document.createElement('div');
    spaceElement.className = 'chart-button';
    spaceElement.textContent = ' ';
    document.getElementById('follow-along').appendChild(spaceElement);
}

// Initialize the app
function init() {
    console.log('DEBUG: Initialization started');
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.addEventListener('click', () => {
            getUserName();
            const vowelSoundsDiv = document.querySelector('#vowel-sounds .chart-container');
            const consonantSoundsDiv = document.querySelector('#consonant-sounds .chart-container');
            if (vowelSoundsDiv) {
                for (const [symbol, soundFile] of Object.entries(phoneticSounds.vowels)) {
                    createButton(symbol, soundFile, vowelSoundsDiv);
                }
            }
            if (consonantSoundsDiv) {
                for (const [symbol, soundFile] of Object.entries(phoneticSounds.consonants)) {
                    createButton(symbol, soundFile, consonantSoundsDiv);
                }
            }
        });

        const clearChartButton = document.getElementById('clear-chart-button');
        if (clearChartButton) {
            clearChartButton.addEventListener('click', clearHighlightedButtons);
        }
    }

    // Add event listeners for drag and drop on follow-along div
    const followAlongDiv = document.getElementById('follow-along');
    if (followAlongDiv) {
        followAlongDiv.addEventListener('dragover', allowDrop);
        followAlongDiv.addEventListener('drop', handleDrop);
    }
}

window.onload = init;
