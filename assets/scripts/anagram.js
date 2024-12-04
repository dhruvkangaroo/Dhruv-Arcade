const startButton = document.getElementById("start")
const reset = document.getElementById("reset")
const score = document.getElementById("score")
const result = document.getElementById("result")
const category = document.getElementById("category-display")
const anagram = document.getElementById("anagram")
const userGuess = document.getElementById("user-guess")
const guessButton = document.getElementById("guess-button")
const roundResult = document.getElementById("round-result")
const nextRound = document.getElementById("next-round")
const roundDisplay = document.getElementById("round")
const rightAnswer = document.querySelectorAll(".right-word")

let usedCat = []
let randWord = ""
let scramWord = ""
let catTitle = ""
let points = 1

/**
 * Our category lists
 */

const animals = ["gibbon", "tapir", "pangolin", "crocodile", "axolotl", "echidna", "tenrec", "ostrich", "gharial", "dugong"]

const movies = ["interstellar", "aliens", "goodfellas", "identity", "hook", "scream", "outbreak", "cliffhanger", "firestarter", "misery"]

const songs = ["kryptonite", "waterfalls", "vogue", "creep", "numb", "thriller", "dreams", "cannonball", "yesterday", "zombie"]

const foods = ["penne", "stromboli", "lutefisk", "haggis", "pierogi", "tripe", "chapati", "tiramisu", "gazpacho", "meatloaf"]

const books = ["middlemarch", "trainspotting", "mindhunter", "steppenwolf", "frankenstein", "carrie", "foundation", "matilda", "emma"]

// Function to select a category and then an item from the selected category
function pickAnagram() {
  // We'd like a random number between 0 and 4
  let randCat = Math.floor(Math.random() * 5)
  console.log(randCat)

  let newCat = []

  // Get our category, display the title
  if (randCat === 0) {
    newCat = animals.slice()
    catTitle = "Animals"
  } else if (randCat === 1) {
    newCat = foods.slice()
    catTitle = "Foods"
  } else if (randCat === 2) {
    newCat = songs.slice()
    catTitle = "Songs"
  } else if (randCat === 3) {
    newCat = movies.slice()
    catTitle = "Movies"
  } else if (randCat === 4) {
    newCat = books.slice()
    catTitle = "Books"
  }

  // Check if already used the category, pick again if so
  if (usedCat.includes(randCat)) {
    pickAnagram()
  } else {
    // If not already used, add to our usedCat and pick a random word from it
    usedCat.push(randCat)
    randWord = newCat[Math.floor(Math.random() * 10)]
    scramble()
  }
}

// Function to scramble the word
function scramble() {
  let arr = randWord.split("")

  arr.sort(() => {
    return 0.5 - Math.random()
  })
  scramWord = arr.join("")
  return scramWord
}

// Function to compare answers and display round/gameover pop up
function compareAnswer() {
  // Get the user's answer
  let answer = userGuess.value.trim().toLowerCase()

  // Set the right word, capitalise it
  let rightWord = randWord.charAt(0).toUpperCase() + randWord.slice(1)

  // Display our right word
  rightAnswer.forEach((item) => {
    item.innerHTML = rightWord
  })
  
  // Comparing guesses, displaying points etc
  if (randWord === answer && points < 5) {
    roundResult.innerHTML = "Correct!"
    points++
    score.innerHTML = points
    roundDisplay.style.display="block"
    nextRound.addEventListener("click", playRound)
    guessButton.removeEventListener("click", compareAnswer)
    userGuess.removeEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault()
        guessButton.click()
      }
    })
  } else if (randWord === answer && points === 5) {
    result.innerHTML = "WIN!"
    document.querySelector("#game-over").style.display="block"
    guessButton.removeEventListener("click", compareAnswer)
    points = 1
  } else {
    result.innerHTML = "LOSE"
    document.querySelector("#game-over").style.display="block"
    guessButton.removeEventListener("click", compareAnswer)
    points = 0
  }
}

// Function to play a round
function playRound() {
  roundDisplay.style.display="none"
  userGuess.value = ""
  guessButton.addEventListener("click", compareAnswer)
  guessButton.addEventListener("mouseover", () => {
    guessButton.innerHTML = "Sure?"
  })
  guessButton.addEventListener("mouseout", () => {
    guessButton.innerHTML = "Enter"
  })
  userGuess.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      guessButton.click()
    }
  })
  pickAnagram()
  category.innerHTML = catTitle
  anagram.innerHTML = scramWord
}

startButton.addEventListener("click", playRound)
reset.addEventListener("click", () => {
  location.reload()
})