// Our elements we want to interact with
const computer = document.getElementById("computer-choice")
const user = document.getElementById("user-choice")
const computerScore = document.getElementById("computer-score")
const userScore = document.getElementById("user-score")
const roundCount = document.getElementById("round")
const roundResult = document.getElementById("result")
const endScore = document.getElementById("end-score")
const gameOver = document.querySelector("#game-over")
const reset = document.getElementById("reset")

const choices = document.querySelectorAll(".selections")
const threeRounds = document.getElementById("three-rounds")
const fiveRounds = document.getElementById("five-rounds")

const classicBtn = document.getElementById("classic")
const rpslsBtn = document.getElementById("rpsls")

// Our global variables
let computerPick
let userPick
let result
let userPoints = 0
let computerPoints = 0
let round = 0
let numberOfRounds = 3
let classicGame = true

function removeListeners() {
  threeRounds.removeEventListener("click", playThree)
  fiveRounds.removeEventListener("click", playFive)
  classicBtn.removeEventListener("click", chooseClassic)
  rpslsBtn.removeEventListener("click", chooseRPSLS)
}

function chooseClassic() {
  classicBtn.classList.add("selected")
  rpslsBtn.classList.remove("selected")
  document.getElementById("lizard").style.display = "none"
  document.getElementById("spock").style.display = "none"
  computer.src = "../assets/images/rps/classic.png"
  user.src = "../assets/images/rps/classic.png"
  classicGame = true
}

function chooseRPSLS() {
  classicGame = false
  rpslsBtn.classList.add("selected")
  classicBtn.classList.remove("selected")
  document.getElementById("lizard").style.display = "inline-block"
  document.getElementById("spock").style.display = "inline-block"
  computer.src = "../assets/images/rps/all.png"
  user.src = "../assets/images/rps/all.png"
}

// Our functions to select our levels
function playThree() {
  threeRounds.classList.add("selected")
  removeListeners()
  numberOfRounds = 3
}

function playFive() {
  fiveRounds.classList.add("selected")
  removeListeners()
  numberOfRounds = 5
}

/**
 * We use the forEach method set the userPick variable from the ID of the image they selected
 * And then call userChoice to display an image, and call computerChoice and compare
 * From Ania Kubow (see credits)
 */
choices.forEach(choice => choice.addEventListener("click", (event) => {
  userPick = event.target.id
  console.log(userPick)
  user.src = `../assets/images/rps/${userPick}.png`
  computerChoice()
  compare()
}))

/**
 * The computerChoice function randomly picks a number and then assigns the computerPick
 * and displays it's choice
 * We could hardcode 3 for choices.length as we're only deciding between 3 options, but
 * if we decide to add an option for the user to select between classic RPS and Rock, Paper,
 * Scissors, Lizard, Spock or another varient, using a global variable makes it more dynamic
 * Adapted from Ania Kubow (see credits)
 */
function computerChoice() {
  let choiceArray = ["rock", "paper", "scissors"]
  if (!classicGame) {
    let extras = ["lizard", "spock"]
    choiceArray.push(...extras)
  }
  computerPick = choiceArray[Math.floor(Math.random() * choiceArray.length)]
  console.log(computerPick)
  computer.src = `../assets/images/rps/${computerPick}.png`
}

/**
 * Our compare function compares the picks, increment points and update
 * our round results
 * It also increments the rounds, displays results and calls endGame to check for a winner
 * Adapted from Ania Kubow (see credits)
 */
 function compare() {
  if (computerPick === userPick) {
    result = "It's a draw."
  } else if (
    computerPick === "rock" && userPick === "paper" ||
    computerPick === "rock" && userPick === "spock" ||
    computerPick === "paper" && userPick === "scissors" ||
    computerPick === "paper" && userPick === "lizard" ||
    computerPick === "scissors" && userPick === "rock" ||
    computerPick === "scissors" && userPick === "spock" ||
    computerPick === "lizard" && userPick === "rock" ||
    computerPick === "lizard" && userPick === "scissors" ||
    computerPick === "spock" && userPick === "paper" ||
    computerPick === "spock" && userPick === "lizard"
  ) {
    userPoints++
    result = "You win!"
  } else {
    computerPoints++
    result = "You lose..."
  }

  endGame()
  round++
  roundCount.innerHTML = round
  roundResult.innerHTML = result
  computerScore.innerHTML = computerPoints
  userScore.innerHTML = userPoints
}

/**
 * Our endGame function compares the user and computer's point tallies to the number of
 * rounds to determine the winner, but returns out of itself if no one has met the
 * requirement
 * numberOfRounds can be set by our earlier level functions
 */
function endGame() {
  if (computerPoints === numberOfRounds) {
    endScore.innerHTML = "YOU LOST"
    gameOver.style.display="block"
  } else if (userPoints === numberOfRounds) {
    endScore.innerHTML = "YOU WON"
    gameOver.style.display="block"
  } else {
    return
  }
}

// Our EventListeners
classicBtn.addEventListener("click", chooseClassic)
rpslsBtn.addEventListener("click", chooseRPSLS)
threeRounds.addEventListener("click", playThree)
fiveRounds.addEventListener("click", playFive)
reset.addEventListener("click", () => {
  location.reload() 
})