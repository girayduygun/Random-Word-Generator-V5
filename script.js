// Import words from the words.js file
let previousWords = [];
let filteredWords = words; // Default to all words
let shuffledWords = [...filteredWords]; // Create a shuffled copy of words
let currentWordIndex = 0;
let intervalId = null;
let remainingTime = 15;
let isPaused = false;

// Function to shuffle words (Fisher-Yates Algorithm)
function shuffleWords() {
  for (let i = shuffledWords.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
  }
}

// Shuffle words when page loads
shuffleWords();

// Function to generate a new word without repetition
function generateRandomWord() {
  if (shuffledWords.length === 0) {
    shuffleWords(); // Reshuffle when all words are used
    currentWordIndex = 0; // Reset index
  }

  displayWord(currentWordIndex);
  currentWordIndex++;
}

// Function to display a word
function displayWord(index) {
  const randomWord = shuffledWords[index];

  document.getElementById("word").innerHTML = randomWord.french;
  document.getElementById("turkishMeaning").innerHTML = ` ${randomWord.turkish}`;
  document.getElementById("sourceMeaning").innerHTML = `Source: ${randomWord.source}`;

  // Store previous words for undo functionality
  if (!previousWords.includes(index)) {
    previousWords.push(index);
  }

  document.getElementById("turkishMeaning").style.display = "none";
}

// Function to toggle the meaning (show/hide)
function toggleMeaning() {
  const turkishElement = document.getElementById("turkishMeaning");
  turkishElement.style.display = turkishElement.style.display === "none" ? "block" : "none";
}

// Undo button functionality to go back to the previous word
function undoWord() {
  if (previousWords.length > 1) {
    previousWords.pop(); // Remove current word from history
    const previousIndex = previousWords[previousWords.length - 1];
    displayWord(previousIndex); // Show previous word
  }
}

// Function to show words in order
let orderIndex = 0;
function showWordInOrder() {
  if (filteredWords.length === 0) {
    document.getElementById("word").innerHTML = "No words available for the selected source.";
    return;
  }

  if (orderIndex < filteredWords.length) {
    displayWord(orderIndex);
    orderIndex++;
  } else {
    orderIndex = 0; // Reset order when list ends
  }
}

// Function to select a word by its source
function selectWordBySource() {
  const selectedSource = document.getElementById("sourceSelector").value;

  if (selectedSource === "") {
    filteredWords = words; // Reset to all words
  } else {
    filteredWords = words.filter((word) => word.source === selectedSource);
  }

  // Reset word history and indexes
  previousWords = [];
  orderIndex = 0;

  if (filteredWords.length > 0) {
    shuffledWords = [...filteredWords];
    shuffleWords();
    displayWord(0); // Show first word from shuffled list
  } else {
    document.getElementById("word").innerHTML = "No words found for the selected source.";
    document.getElementById("turkishMeaning").innerHTML = "";
    document.getElementById("sourceMeaning").innerHTML = "";
  }
}

// Create a "Play/Pause" toggle button
const toggleButton = document.createElement("button");
toggleButton.innerText = "⏸️ Pause"; // Default to Pause
toggleButton.id = "toggleButton"; // Set ID for styling
document.body.appendChild(toggleButton);

// Toggle Play/Pause when button is clicked
toggleButton.addEventListener("click", () => {
  isPaused = !isPaused; // Switch state
  toggleButton.innerText = isPaused ? "▶️ Play" : "⏸️ Pause"; // Change button text
});

// Function to start automation
function startAutomation() {
  if (!intervalId) {
    intervalId = setInterval(() => {
      if (!isPaused) {
        generateRandomWord();
        remainingTime = 15;

        setTimeout(() => {
          if (!isPaused) {
            toggleMeaning();
          }
        }, 8000);
      }
    }, 15000);
  }
}

// Function to stop automation
function stopAutomation() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

// Start automation when the page loads
startAutomation();
