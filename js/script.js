const phoneticSounds = {
  const phoneticSounds = {
    vowels: {
        "æ": "sounds/sound_æ.mp3", // 1
        "ɔ": "sounds/sound_ɔ.mp3", // 2
        "a": "sounds/sound_a.mp3", // 3
        "ei": "sounds/sound_ei.mp3", // 4
        "ii": "sounds/sound_ii.mp3", // 5
        "e": "sounds/sound_e.mp3", // 6
        "ai": "sounds/sound_ai.mp3", // 7
        "o": "sounds/sound_o.mp3", // 8
        "u": "sounds/sound_u.mp3", // 9
        "ɘ": "sounds/sound_ɘ.mp3", // 10
        "au": "sounds/sound_au.mp3", // 11
        "ʊ": "sounds/sound_ʊ.mp3", // 12
        "oi": "sounds/sound_oi.mp3", // 13
        "ɜ": "sounds/sound_ɜ.mp3", // 14
        "eɜ": "sounds/sound_eɜ.mp3", // 15
        "iɜ": "sounds/sound_iɜ.mp3", // 16
        "aɝ": "sounds/sound_aɝ.mp3", // 17
        "ɔɝ": "sounds/sound_ɔɝ.mp3", // 18
        "ju": "sounds/sound_ju.mp3", // 19
        "i": "sounds/sound_i.mp3" // 20
    },
    consonants: {
        "b": "sounds/sound_b.mp3", // 21
        "p": "sounds/sound_p.mp3", // 22
        "d": "sounds/sound_d.mp3", // 23
        "f": "sounds/sound_f.mp3", // 24
        "v": "sounds/sound_v.mp3", // 25
        "g": "sounds/sound_g.mp3", // 26
        "k": "sounds/sound_k.mp3", // 27
        "h": "sounds/sound_h.mp3", // 28
        "l": "sounds/sound_l.mp3", // 29
        "m": "sounds/sound_m.mp3", // 30
        "n": "sounds/sound_n.mp3", // 31
        "θ": "sounds/sound_θ.mp3", // 32
        "ð": "sounds/sound_ð.mp3", // 33
        "s": "sounds/sound_s.mp3", // 34
        "z": "sounds/sound_z.mp3", // 35
        "r": "sounds/sound_r.mp3", // 36
        "j": "sounds/sound_j.mp3", // 37
        "t": "sounds/sound_t.mp3", // 38
        "y": "sounds/sound_y.mp3", // 39
        "w": "sounds/sound_w.mp3", // 40
        "ŋ": "sounds/sound_ŋ.mp3", // 41
        "ʃ": "sounds/sound_ʃ.mp3", // 42
        "tʃ": "sounds/sound_tʃ.mp3", // 43
        "Ʒ": "sounds/sound_Ʒ.mp3", // 44
        "ʤ": "sounds/sound_ʤ.mp3" // 45
    }
};
let isPlaying = false; // Track if sounds are playing

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
    const welcomeLabel = document.createElement('h2');
    welcomeLabel.textContent = welcomeMessage;
    document.body.prepend(welcomeLabel);

    const utterance = new SpeechSynthesisUtterance(welcomeMessage);
    utterance.pitch = 1.2;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);

    const startButton = document.getElementById('start-button');
    if (startButton) startButton.style.display = 'none';
}

// Function to create a phonetic button
function createButton(symbol, soundFile, container) {
    const button = document.createElement('div');
    button.className = 'chart-button';
    button.textContent = `/${symbol}/`;
    button.onclick = () => handleButtonClick(button, soundFile);
    container.appendChild(button);
}

function handleButtonClick(button, soundFile) {
    // Remove highlight from all buttons first
    const buttons = document.querySelectorAll('.chart-button');
    buttons.forEach(btn => btn.classList.remove('highlighted'));

    // Play the sound and highlight the clicked button
    playSound(soundFile).then(() => {
        button.classList.remove('highlighted');
    });
    button.classList.add('highlighted');
    const clone = button.cloneNode(true);
    clone.dataset.soundFile = soundFile;
    clone.classList.remove('highlighted');
    document.getElementById('follow-along').appendChild(clone);
}

// Clear Follow Along Chart
function clearFollowAlong() {
    const dynamicContentDiv = document.getElementById('dynamic-content');
    if (dynamicContentDiv) {
        dynamicContentDiv.innerHTML = '';
    } else {
        console.error("ERROR: Dynamic content div not found.");
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
                    console.log(`DEBUG: Creating button for symbol: /${symbol}/`);
                    createButton(symbol, soundFile, vowelSoundsDiv);
                }
            } else {
                console.error("ERROR: Vowel sounds container not found.");
            }

            if (consonantSoundsDiv) {
                for (const [symbol, soundFile] of Object.entries(phoneticSounds.consonants)) {
                    createButton(symbol, soundFile, consonantSoundsDiv);
                }
            } else {
                console.error("ERROR: Consonant sounds container not found.");
            }
        });

        // Adding event listener for Clear Chart button
        const clearChartButton = document.getElementById('clear-chart-button');
        if (clearChartButton) {
            clearChartButton.addEventListener('click', () => {
                clearHighlightedButtons(); // Clear highlighted buttons
            });
        } else {
            console.error('ERROR: Clear Chart button not found.');
        }
    } else {
        console.error('ERROR: Start button not found.');
    }
}

window.onload = init;
