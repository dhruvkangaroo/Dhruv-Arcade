// Our HTML elements
const board = document.getElementById("board")
const result = document.getElementById("result")
const score = document.getElementById("score")
const endScore = document.getElementById("end-score")
const startButton = document.getElementById("start")
const reset = document.getElementById("reset")
const wrapToggle = document.getElementById("change-wrap")
const fire = document.getElementById("fire")
const left = document.getElementById("left")
const right = document.getElementById("right")
const wrap = document.getElementById("wrap")
const tankLives = document.getElementById("tank-lives")

// Our global variables
let currentPosition = 217
let width = 15
let direction = 1
let goingRight = true
let invadersRemoved = []
let points = 0
let gameEnd = ""
let invadersId = 0
let intervalTime = 0
let noWrap = true

let tankHealth = 3
let bossHealth = 3
let bossId = 0
let bossPosition = 14
let bossGoingRight = true
let bossDirection = 1
let bossDied = false
let invadersDead = false
let bombInterval
let currentLevel = 1

// Explosion sound effect
let soundExplosion = new Audio("../assets/sounds/explosion.mp3")
soundExplosion.volume = 0.1
soundExplosion.playbackRate = 4

/**
 * Our for loop creating our board
 * From Ania Kubow (see credits)
 */
for (let i = 0; i < 210; i++) {
  const square = document.createElement("div")
  board.appendChild(square)
}

// Adding end tiles to board 
for (let i = 0; i < width * 3; i++) {
  const endTile = document.createElement("div")
  endTile.classList.add("end-tile")
  board.appendChild(endTile)
}

const squares = Array.from(document.querySelectorAll("#board div"))

/**
 * Our invaders array, could create multiple arrays to call depending on level
 * From Ania Kubow (see credits) - 02/07, update to empty array with multiple to populate
 */
let invaders = []

// invader arrays?
const invadersOne = [
  0, 1, 2, 4, 5, 7, 8, 9,
  16, 17, 18, 21, 22, 23,
  30, 32, 34, 35, 37, 39
]

const invadersTwo = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  15, 16, 19, 20, 23, 24,
  30, 32, 34, 35, 37, 39
]

const invadersThree = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

/**
 * Function to add invaders to the board
 * From Ania Kubow (see credits)
 */
function draw() {
  for (let i = 0; i < invaders.length; i++) {
    if (!invadersRemoved.includes(i)){
      squares[invaders[i]].classList.add("invader")
    }
  }
}

/**
 * Function to remove invaders from the board
 * From Ania Kubow 
 */ 
function remove() {
  for (let i = 0; i < invaders.length; i++) {
    squares[invaders[i]].classList.remove("invader")
  }
}

// Function to change wrap for invaders
function changeWrap() {
  if (noWrap === true) {
    noWrap = false
    wrap.innerHTML = "ON"
    return
  } else if (noWrap === false) {
    noWrap = true
    wrap.innerHTML = "OFF"
  }
  return 
}

/**
 * Move the invaders back and forth across the screen
 * Adapted from Ania Kubow (see credits)
 */
function moveInvaders() {
  const leftEdge = invaders[0] % width === 0
  const rightEdge = invaders[invaders.length - 1] % width === width - 1
  remove()

  // Bounces the invaders off the edges of the screen. If noWrap === false invaders can wrap instead
  if (rightEdge && goingRight && noWrap) {
    for (let i = 0; i < invaders.length; i++) {
      invaders[i] += width + 1
      direction = - 1
      goingRight = false
    }
  }

  if (leftEdge && !goingRight && noWrap) {
    for (let i = 0; i < invaders.length; i++) {
      invaders[i] += width - 1
      direction = 1
      goingRight = true
    }
  }

  for (let i = 0; i < invaders.length; i++) {
    invaders[i] += direction
  }
  draw() 
  
  if (invaders.length === invadersRemoved.length) {
    invadersDead = true
    clearInterval(invadersId)
  }
  checkEnd()
}

// Function to spawn the boss ship and move it back and forth
function spawnBoss() {
  bossId = setInterval(moveBoss, intervalTime)
  bombInterval = setInterval(dropBomb, 1500)
  
  function moveBoss() {
    squares[bossPosition].classList.remove("boss")
    bossPosition += bossDirection
    squares[bossPosition].classList.add("boss")
    bombInterval

    if (bossPosition === 29 && bossGoingRight) {
    bossDirection = - 1
    bossGoingRight = false
    }
    
    if (bossPosition === 15 && !bossGoingRight) {
    bossDirection  = + 1
    bossGoingRight = true
    }
  }
}

/**
 * function for boss to drop bombs and kill the tank
 */
 function dropBomb() {
  soundExplosion.muted = false
  let bombId = setInterval(moveBomb, 200)
  let bombPosition = bossPosition
  
  function moveBomb() {
    squares[bombPosition].classList.remove("bomb")
    bombPosition += width
    squares[bombPosition].classList.add("bomb")

    if (bombPosition > (squares.length - 31)) {
      squares[bombPosition].classList.remove("bomb")
      clearInterval(bombId)
      return
    }

    if (squares[bombPosition].classList.contains("tank")) {
      squares[bombPosition].classList.remove("bomb")
      squares[bombPosition].classList.add("boom")
      soundExplosion.play()
      setTimeout(() => squares[bombPosition].classList.remove("boom"), 200)
      clearInterval(bombId)
      tankHealth--
      tankLives.innerHTML = tankHealth
    }
    checkEnd()
  }
}

/**
 * Function to move the tank across the bottom of the screen
 * Can control the tank with arrows, a and d keys or the arrows on the screen
 */
 function moveTank(event) {
  squares[currentPosition].classList.remove("tank")
  if ((event.key === "ArrowLeft" || event.key === "a" || event.target.id === "left") && currentPosition % width !== 0){
    currentPosition--
  }
  if ((event.key === "ArrowRight" || event.key === "d" || event.target.id === "right") && currentPosition % width < width - 1) {
    currentPosition++
  }
  squares[currentPosition].classList.add("tank")
} 

/**
 * shoot function to create and move the missile and kill invaders.
 * Can trigger with up arrow, space or fire button on page
 * Adapted from Ania Kubow (see credits)
 */ 
function shoot(event) {
  soundExplosion.muted = false
  let missileId
  let missilePosition = currentPosition

  function movemissile() {
    squares[missilePosition].classList.remove("missile")
    missilePosition -= width
    squares[missilePosition].classList.add("missile")

    if (missilePosition <= 14) {
      squares[missilePosition].classList.remove("missile")
      clearInterval(missileId)
      return
    }
      
    if (squares[missilePosition].classList.contains("invader")) {
      squares[missilePosition].classList.remove("missile")
      squares[missilePosition].classList.remove("invader")
      squares[missilePosition].classList.add("boom")
      soundExplosion.play()

      setTimeout(() => squares[missilePosition].classList.remove("boom"), 200)
      clearInterval(missileId)

      const invaderRemoved = invaders.indexOf(missilePosition)
      invadersRemoved.push(invaderRemoved)
      points++
      score.innerHTML = points
    }

    if (squares[missilePosition].classList.contains("boss") && bossHealth > 1) {
      squares[missilePosition].classList.remove("missile")
      squares[missilePosition].classList.add("boom")
      soundExplosion.play()
      bossHealth--
      setTimeout(() => squares[missilePosition].classList.remove("boom"), 200)
      clearInterval(missileId)
      
      } else if (squares[missilePosition].classList.contains("boss") && bossHealth <= 1) {
      squares[missilePosition].classList.remove("missile")
      squares[missilePosition].classList.remove("boss")
      squares[missilePosition].classList.add("boom")
      soundExplosion.play()

      clearInterval(bossId)
      setTimeout(() => squares[missilePosition].classList.remove("boom"), 200)
      clearInterval(missileId)
      bossDied = true
      clearInterval(bombInterval)
      points++
      score.innerHTML = points
      }
    checkEnd()
  }

  if (event.key === "ArrowUp" || event.keyCode === 32 || event.target.id === "fire") {
    missileId = setInterval(movemissile, 100)
    document.removeEventListener("keydown", shoot)
    fire.removeEventListener("click", shoot)
    setTimeout(() => {
      document.addEventListener("keydown", shoot)
      fire.addEventListener("click", shoot)
    }, 500)
  }
}

// Conditions to trigger the endGame function
function checkEnd() {
  if (squares[currentPosition].classList.contains("invader","tank")) {
        gameEnd = "DIED"
        endGame()
    }
    
  for (let i = 0; i < (squares.length); i++) {
    if (squares[i].matches(".invader.end-tile")) {
      gameEnd = "DIED"
      endGame()
    }
  }

  if (tankHealth <= 0) {
    gameEnd = "DIED"
    endGame()
  }

  if (invadersDead && bossDied) {
    if (currentLevel === 1) {
      resetVariables()
      levelTwo()
      currentLevel++
    } else if (currentLevel === 2) {
      resetVariables()
      levelThree()
      currentLevel++
    } else if (currentLevel === 3) {
      gameEnd = "WIN"
      endGame()
    }
  }
}

// DRY, right?
function resetVariables() {
  clearInterval(invadersId)
  clearInterval(bossId)
  invadersDead = false
  bossDied = false
  bossHealth = 3
  invadersRemoved.length = 0
}

// endGame function
function endGame() {
  clearInterval(bossId)
  clearInterval(invadersId)
  result.innerHTML = gameEnd
  endScore.innerHTML = points
  document.querySelector("#game-over").style.display="block"
}

// startGame function 
function startGame() {
  soundExplosion.muted = true
  soundExplosion.play()
  wrapToggle.removeEventListener("click", changeWrap)
  startButton.removeEventListener("click", startGame)
  levelOne()
  points = 0
  gameEnd = ""
}

// Level functions
function levelOne() {
  invaders = invadersOne
  intervalTime = 750
  invadersId = setInterval(moveInvaders, intervalTime)
  setTimeout(() => {
    spawnBoss()
  }, 10000)
}

function levelTwo() {
  invaders = invadersTwo
  intervalTime = 500
  invadersId = setInterval(moveInvaders, intervalTime)
  setTimeout(() => {
    spawnBoss()
  }, 10000)
}

function levelThree() {
  invaders = invadersThree
  intervalTime = 250
  invadersId = setInterval(moveInvaders, intervalTime)
  setTimeout(() => {
    spawnBoss()
  }, 10000)
}

squares[currentPosition].classList.add("tank")
//Our event listeners
document.addEventListener("keydown", shoot)
document.addEventListener("keydown", moveTank)
startButton.addEventListener("click", startGame)
fire.addEventListener("click", shoot)
left.addEventListener("click", moveTank)
right.addEventListener("click", moveTank)
reset.addEventListener("click", () => {
  location.reload() 
})
wrapToggle.addEventListener("click", changeWrap)