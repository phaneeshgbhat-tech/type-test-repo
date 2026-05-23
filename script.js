// Dictionary holding 5 specific progressive typing difficulty levels
const textPools = {
    "very-easy": [
        "the cat sat on the red mat and ran after a small fat rat",
        "big dogs like to bark at the blue car down the long old road",
        "you need to take a quick walk in the sun to feel good today"
    ],
    "easy": [
        "The quick brown fox jumps over a lazy dog while running away.",
        "Coding a simple website with html and css is a great way to learn.",
        "Please remember to double check your work before submitting the file."
    ],
    "medium": [
        "The core of code development relies entirely on persistent muscle memory and attention to structural details.",
        "Consistent practice turns complex programming syntax into intuitive expressions of human thoughts.",
        "To understand the future of computing architecture one must first grasp the foundations of logical arrays."
    ],
    "hard": [
        "In 2026, over 75.8% of global software engineering stacks utilize asynchronous JavaScript frameworks!",
        "Warning: If index[i] is less than or equal to total_count, executing user_callback() might trigger an overflow error.",
        "The client's budget increased by $4,500; however, the project deadline remains fixed for September 14th."
    ],
    "expert": [
        "const processData = (arr) => arr.filter(x => x !== null).map(y => y * 2); // inline transformation pipeline",
        "function initEngine({id, speed: s}) { return id ? RegExp(`^\\\\d{${s}}$`).test('123') : false; }",
        "while(ptr && ptr.next) { [ptr.val, ptr.next.val] = [ptr.next.val, ptr.val]; ptr = ptr.next.next; }"
    ]
};

const TEST_DURATION = 30; // Global clock speed constraint variable

let timerLeft = TEST_DURATION;
let timerInterval = null;
let isTestRunning = false;
let currentQuote = "";
let characterSpans = [];
let typedIndex = 0;

// Metric evaluation tracking variables
let totalKeystrokes = 0;
let correctKeystrokes = 0;

// Locate DOM Targets
const textDisplay = document.getElementById('text-display');
const keyboardTracker = document.getElementById('keyboard-tracker');
const timerDisplay = document.getElementById('timer');
const testScreen = document.getElementById('test-screen');
const resultsScreen = document.getElementById('results-screen');
const difficultySelect = document.getElementById('difficulty');

// Setup application workflow cycle state
function init() {
    // Clear out active timers synchronously to manage resets
    clearInterval(timerInterval);
    
    // Acquire active tier allocation parameters
    const selectedLevel = difficultySelect.value;
    const activePool = textPools[selectedLevel];
    
    // Pick phrase random variance index choice
    currentQuote = activePool[Math.floor(Math.random() * activePool.length)];
    
    textDisplay.innerHTML = '';
    typedIndex = 0;
    totalKeystrokes = 0;
    correctKeystrokes = 0;
    timerLeft = TEST_DURATION;
    isTestRunning = false;
    
    timerDisplay.innerText = timerLeft;

    // Split target sentence apart and encapsulate into isolated spans
    currentQuote.split('').forEach(char => {
        const span = document.createElement('span');
        span.classList.add('char');
        span.innerText = char;
        textDisplay.appendChild(span);
    });

    characterSpans = textDisplay.querySelectorAll('.char');
    if (characterSpans.length > 0) {
        characterSpans[0].classList.add('current');
    }
    
    keyboardTracker.value = '';
    focusTracker();
}

function focusTracker() {
    keyboardTracker.focus();
}

// Track and validate structural keyboard input arrays
keyboardTracker.addEventListener('input', () => {
    // Fire timer execution loop once first character records
    if (!isTestRunning && timerLeft === TEST_DURATION) {
        startTimer();
    }

    const inputVal = keyboardTracker.value;
    
    // Handle destructive backspace movements natively
    if (inputVal.length < typedIndex) {
        if (typedIndex > 0) {
            characterSpans[typedIndex].classList.remove('current', 'correct', 'incorrect');
            typedIndex--;
            characterSpans[typedIndex].classList.remove('correct', 'incorrect');
            characterSpans[typedIndex].classList.add('current');
        }
        return;
    }

    // Boundary safety verification lock
    if (typedIndex >= characterSpans.length) return;

    const currentTypedChar = inputVal[inputVal.length - 1];
    totalKeystrokes++;
    const targetChar = currentQuote[typedIndex];

    characterSpans[typedIndex].classList.remove('current');
    
    // Evaluate logic mapping accuracy states
    if (currentTypedChar === targetChar) {
        characterSpans[typedIndex].classList.add('correct');
        correctKeystrokes++;
    } else {
        characterSpans[typedIndex].classList.add('incorrect');
    }

    typedIndex++;
    
    // Update active cursor indexing pointer forward
    if (typedIndex < characterSpans.length) {
        characterSpans[typedIndex].classList.add('current');
    } else {
        endTest(); // Finished string sequence ahead of deadline limits
    }
});

function startTimer() {
    isTestRunning = true;
    timerInterval = setInterval(() => {
        timerLeft--;
        timerDisplay.innerText = timerLeft;
        
        if (timerLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function endTest() {
    clearInterval(timerInterval);
    isTestRunning = false;
    
    const timeSpentInMinutes = (TEST_DURATION - timerLeft) / 60;
    
    // Execute algorithmic metric formulas
    const cpm = timeSpentInMinutes > 0 ? Math.round(correctKeystrokes / timeSpentInMinutes) : 0;
    const wpm = Math.round(cpm / 5); // 5 characters standardized maps to 1 typographic word
    const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 0;

    // Print calculated outcomes down to targeted DOM fields
    document.getElementById('res-wpm').innerText = wpm;
    document.getElementById('res-cpm').innerText = cpm;
    document.getElementById('res-accuracy').innerText = accuracy + "%";

    // Set dynamic evaluation values
    const tierBadge = document.getElementById('tier-badge');
    if (wpm < 30) {
        tierBadge.innerText = "🐢 Tortoise";
    } else if (wpm >= 30 && wpm <= 70) {
        tierBadge.innerText = "🐴 Horse";
    } else {
        tierBadge.innerText = "🐆 Cheetah";
    }

    // Toggle screen layer visibility cards
    testScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
}

function resetTest() {
    resultsScreen.classList.add('hidden');
    testScreen.classList.remove('hidden');
    init();
}

// Load initialization pipeline variables upon screen setup completion
window.onload = init;