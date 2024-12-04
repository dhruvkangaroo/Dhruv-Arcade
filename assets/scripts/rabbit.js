// Get our elements we want to change with JS
const board = document.getElementById("board")
const startOne = document.getElementById("start-one")
const startTwo = document.getElementById("start-two")
const startThree = document.getElementById("start-three")
const reset = document.getElementById("reset")

let time = document.getElementById("time")
let score = document.getElementById("score")
let endScore = document.getElementById("end-score")

// Declaring our global variables
let points = 0
let timeUp = false
let lastHole
let countdown
let difficulty
let numberOfHoles
let holesArray = []
let holes = []
let rabbits = []
let moles = 0

// Hit sound
let soundHit = new Audio("../assets/sounds/hit.mp3")
soundHit.volume = 0.3
soundHit.playbackRate = 1.5

/**
 * Function to generate the holes and rabbits
 * Can change the number of holes when levels are selected
 */
function createHoles() {
  for (let i = 0; i < numberOfHoles; i++) {
    const hole = document.createElement("div")
    hole.classList.add("hole")
    holesArray.push(hole)

    const rabbit = document.createElement("div")
    rabbit.classList.add("rabbit")

    board.appendChild(hole)
    hole.appendChild(rabbit)  
  }
}

// Function to disable the level buttons
function disableButtons() {
  startOne.removeEventListener("click", levelOne)
  startTwo.removeEventListener("click", levelTwo)
  startThree.removeEventListener("click", levelThree)
  setTimeout(() => {
    startOne.addEventListener("click", levelOne)
    startTwo.addEventListener("click", levelTwo)
    startThree.addEventListener("click", levelThree)
  }, 30000)
}

/**
 * We want the user to be able to select from three levels of difficulty/speed.
 * The functions below are triggered by event listeners linked to buttons
 * They set the difficulty level, start the game and disable the buttons from being selected once the game starts
 */
function levelOne() {
  moles = 1
  startOne.classList.add("selected")
  numberOfHoles = 6
  difficulty = "easy"
  disableButtons()
  startGame()
}

function levelTwo() {
  moles = 2
  startTwo.classList.add("selected")
  numberOfHoles = 9
  difficulty = "medium"
  disableButtons()
  startGame()
}

function levelThree() {
  moles = 3
  startThree.classList.add("selected")
  numberOfHoles = 9
  difficulty = "hard"
  disableButtons()
  startGame()
}

/** 
 * Function to pick a random hole to pop out of; used in our popUp function
 * Using Math.random to generate a random number up to the number of holes we're generating.
 * Math.floor makes it a whole integer
 * @param {array} holes - takes our holes array
 * @return {variable} hole - returns a hole div to pop out of
 * From Franks Laboratory (see credit)
 */
function randomHole(holes) {
  let pickHole = Math.floor(Math.random() * numberOfHoles)
  let hole = holes[pickHole]

  if (moles > 0) {
    let randomNum = Math.floor(Math.random() * 20)
    if (randomNum === 1) {
      hole.firstChild.classList.add("mole")
      moles--
    }
  }

  // We don't want the rabbit to pop out of the same hole multiple times in a row
  if (hole === lastHole) {
    return randomHole(holes)
  }

  lastHole = hole
  return hole
}

/**
 * We want the rabbit to pop up at varying speeds within parameters we'll set, so the levelSpeed
 * function generates random numbers between our min and max
 * @param {number} min - the minimum speed we want rabbits to pop up
 * @param {number} max - the maximum speed we want rabbits to pop up
 * @return {number} - a random number in between
 */
function levelSpeed(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

/**
 * PopUp function to move the rabbits
 * First an if/else statement determines the speed based on the difficulty set previously,
 * passes parameters into levelSpeed function
 * Then the "up" class is added to the holes to raise the rabbit and the setTimeout 
 * function removes that class based on the speed selected
 */
function popUp() {
  let speed
  if (difficulty === "easy") {
    speed = levelSpeed(1200, 2000)
  } else if (difficulty === "medium") {
    speed = levelSpeed(800, 1500)
  } else if (difficulty === "hard") {
    speed = levelSpeed(400, 1000)
  }
  
  // Adapted from Franks Laboratory (see credit)
  let hole = randomHole(holes)
  hole.classList.add("up")
  setTimeout(() => {
    hole.classList.remove("up")
    hole.firstChild.classList.remove("mole")
    if (!timeUp) popUp()
  }, speed)
}

/**
 * The slap function increments the points when a rabbit is clicked.
 * It also changes the image, which then changes back with the aid of the setTimeout function.
 * PointerEvents are paused for the rabbit to prevent the user from clicking multiple times
 * Adapted from Franks Laboratory
 */
 function slap(){
  if (this.classList.contains("mole")) {
    countdown = 0
    document.getElementById("auto-lose").innerHTML = "YOU SLAPPED A MOLE!"
  }
  points++
  score.innerHTML = points
  this.style.backgroundImage = "url('../assets/images/rabbit/rabbit-bonk.png')"
  this.style.pointerEvents = "none"
  soundHit.play()
  setTimeout(() => {
    this.style.backgroundImage = "url('../assets/images/rabbit/rabbit.png')"
    this.style.pointerEvents = "all"
  }, 900)
}

/**
 * And then the startGame function ties everything together.
 * When called by the level functions above, it starts a countdown, resets elements 
 * and calls the popUp function
 * The setInterval function within begins the countdown that eventually ends the game, stops the popUp
 * function and displays the game over screen with the user's score
 * Adapted from Frank's Laboratory
 */
function startGame() {
  createHoles()
  holes = document.querySelectorAll(".hole")
  rabbits = document.querySelectorAll(".rabbit")
  rabbits.forEach(rabbit => rabbit.addEventListener("click", slap))
  countdown = 30
  time.innerHTML = countdown
  score.innerHTML = 0
  endScore.innerHTML = 0
  timeUp = false
  points = 0
  popUp()

  let startTime = setInterval(() => {
    countdown--
    time.innerHTML = countdown
    if (countdown < 1) {
      timeUp = true
      countdown = 0
      clearInterval(startTime)
      time.innerHTML = "Time up!"
      endScore.innerHTML = points
      document.querySelector("#game-over").style.display="block"
    }
  }, 1000)
}

/**
 * Event listeners to handle user interaction on the page:
 * Allow for interacting with the rabbits when they pop up.
 * Allow for page to be reloaded mid-game.
 * Allow for level select when buttons interacted on page.
 * Could use onclick() in HTML for buttons but better practice to separate HTML and JS
 */
startOne.addEventListener("click", levelOne)
startTwo.addEventListener("click", levelTwo)
startThree.addEventListener("click", levelThree)
reset.addEventListener("click", () => {
  location.reload() 
})