const startButton = document.getElementById("start")
const resetButton = document.getElementById("reset")
const livesDisplay = document.getElementById("lives")
const correctDisplay = document.getElementById("correct")
const timerDisplay = document.getElementById("timer")
const placeholders = document.getElementById("placeholders")
const endResult = document.getElementById("end-result")
const roundResult = document.getElementById("round-result")
const nextRound = document.getElementById("next-round")
const reset = document.getElementById("reset")

// Our cards
const cardsArray = [
  {
    name: "cat",
    img: "../assets/images/memory-cards/cat.webp",
  },
  {
    name: "cow",
    img: "../assets/images/memory-cards/cow.webp",
  },
  {
    name: "gorilla",
    img: "../assets/images/memory-cards/gorilla.webp",
  },
  {
    name: "elephant",
    img: "../assets/images/memory-cards/elephant.webp",
  },
  {
    name: "hippo",
    img: "../assets/images/memory-cards/hippo.webp",
  },
  {
    name: "lion",
    img: "../assets/images/memory-cards/lion.webp",
  },
  {
    name: "parrot",
    img: "../assets/images/memory-cards/parrot.webp",
  },
  {
    name: "bat",
    img: "../assets/images/memory-cards/bat.webp",
  },
  {
    name: "chameleon",
    img: "../assets/images/memory-cards/chameleon.webp",
  },
  {
    name: "deer",
    img: "../assets/images/memory-cards/deer.webp",
  },
  {
    name: "frog",
    img: "../assets/images/memory-cards/frog.webp",
  },
  {
    name: "ram",
    img: "../assets/images/memory-cards/ram.webp",
  },
  {
    name: "raven",
    img: "../assets/images/memory-cards/raven.webp",
  },
  {
    name: "sabre",
    img: "../assets/images/memory-cards/sabre.webp",
  },
  {
    name: "turtle",
    img: "../assets/images/memory-cards/turtle.webp",
  },
  {
    name: "walrus",
    img: "../assets/images/memory-cards/walrus.webp",
  },
]

// Global variables
let livesLeft = 3
let countdown = 10
let correct = 0
let timeUp = false
let gameBoard = []
let displayCards = []
let optionCards = []
let correctCard

// Start to make our board
const board = document.getElementById("board")
const grid = document.createElement("div")
grid.classList.add("grid")
board.appendChild(grid)

// Start of our choices display
const choices = document.getElementById("choices")
const userChoices = document.createElement("div")
userChoices.classList.add("choice-display")
choices.appendChild(userChoices)

// Question card
let questionCard = {
  img: "../assets/images/missing-item/missing-logo-white.png"
}

/** 
 * When we press start, we want to create our board in it's first state
 * First thing to do is to select our cards
 */
function firstState() {
  clearBoard()
  gameBoard.length = 0
  displayCards.length = 0
  optionCards.length = 0
  let gameCards = []
  gameCards = 0
  gameCards = cardsArray.slice(0)
  // Shuffle all our cards
  gameCards.sort(() => 0.5 - Math.random())
  // Take 9 for our board to create the cards
  gameBoard = gameCards.splice(0, 9)
  gameBoard.forEach((item) => {
    const card = document.createElement("div")
    card.classList.add("card")
    card.dataset.name = item.name
    card.style.backgroundImage = `url(${item.img})`

    grid.appendChild(card)
  })

  // Take 2 cards and save to our user options
  optionCards = gameCards.splice(-2, 2)
  startButton.removeEventListener("click", firstState)
  countdownTimer()
}

function countdownTimer() {
  let startTimer = setInterval(() => {
    countdown--
    timerDisplay.innerHTML = countdown
    if (countdown < 1) {
      timeUp = true
      countdown = 0
      timerDisplay.innerHTML = "Time Up!"
      secondState()
      clearInterval(startTimer)
    }
  }, 1000)
}

// Function to empty the game board between rounds
function clearBoard() {
  while (grid.hasChildNodes()){
    grid.removeChild(grid.lastChild)
  }
  while(userChoices.hasChildNodes()){
    userChoices.removeChild(userChoices.lastChild)
  }
  placeholders.style.display = "grid"
  document.querySelector("#round").style.display="none"
}

// Select our correct card, reset the board, load remaining cards with a question card
function secondState() {
  // Shuffle the board
  let secondBoard = gameBoard.sort(() => 0.5 - Math.random())
  // Clear the existing board
  clearBoard()
  // Take a card
  correctCard = secondBoard.pop()
  // Add a questionCard, shuffle and display our board
  secondBoard.push(questionCard)
  secondBoard.sort(() => 0.5 - Math.random())
  secondBoard.forEach((item) => {
    const card = document.createElement("div")
    card.classList.add("card")
    card.style.backgroundImage = `url(${item.img})`

    grid.appendChild(card)
  })
  // Add our correct card to our choices
  let duplicateCorrect = correctCard
  optionCards.push(duplicateCorrect)
  optionCards.sort(() => 0.5 - Math.random)
  optionCards.forEach((item) => {
    const card = document.createElement("div")
    card.classList.add("card")
    card.dataset.name = item.name
    card.style.backgroundImage = `url(${item.img})`
    card.addEventListener("click", evaluateChoice)

    userChoices.appendChild(card)
  })
  // Hide the placeholders
  placeholders.style.display = "none"
  countdown = 10
}

function evaluateChoice(event) {
  let userPick = event.target.getAttribute("data-name")

  if ((userPick === correctCard.name) && correct === 2) {
    correct++
    correctDisplay.innerHTML = correct
    endResult.innerHTML = "WON"
    document.querySelector("#game-over").style.display="block"
    startButton.addEventListener("click", firstState)
  } else if ((userPick === correctCard.name) && correct < 2) {
    correct++
    correctDisplay.innerHTML = correct
    roundResult.innerHTML = "CORRECT!"
    document.querySelector("#round").style.display="block"
  } else if ((userPick !== correctCard.name) && livesLeft > 1) {
    livesLeft--
    livesDisplay.innerHTML = livesLeft
    roundResult.innerHTML = "WRONG!"
    document.querySelector("#round").style.display="block"
  } else if ((userPick !== correctCard.name) && livesLeft === 1) {
    livesLeft--
    livesDisplay.innerHTML = livesLeft
    endResult.innerHTML = "LOST"
    document.querySelector("#game-over").style.display="block"
  }
nextRound.addEventListener("click", firstState)
}

startButton.addEventListener("click", firstState)
reset.addEventListener("click", () => {
  location.reload() 
})