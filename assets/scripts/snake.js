const boardElement = document.getElementById("board")

const score = document.getElementById("score")
const time = document.getElementById("time")
const endTime = document.getElementById("end-time")
const endScore = document.getElementById("end-score")
const start = document.getElementById("start")

let boardSize = 100

function createBoard() {
  let numberofTiles = boardSize
  for (let i = 0; i < numberofTiles; i++){
    const card = document.createElement("div")
    card.classList.add("tile")
        
    boardElement.appendChild(card);
  }
}

createBoard()

const width = 10
let currentIndex = 0
let applePosition = 0
let currentSnake = [2, 1, 0]
let direction = 1
let points
let speed = 0.9
let intervalTime = 0
let interval = 0
let turn = "east"
let timer
let gameOver = false

const squares = document.querySelectorAll(".tile")

// Start/restart
function startGame() {
  currentSnake.forEach(index => squares[index].classList.remove("snake"))
  squares[applePosition].classList.remove("apple")
  clearInterval(interval)
  points = 0
  timer = 0
  randomApple()
  direction = 1
  score.innerHTML = points
  intervalTime = 1000
  currentSnake = [2, 1, 0]
  currentIndex
  currentSnake.forEach(index => squares[index].classList.add("snake"))
  interval = setInterval(moveOutcomes, intervalTime)

  let startTime = setInterval(() => {
    timer++
    time.innerHTML = timer
    if (gameOver) {
      timer = 0
      clearInterval(startTime)
    }
  }, 1000)
}

//Function for movements, collisions etc
function moveOutcomes() {
  if (
      (currentSnake[0] + width >= (width * width) && direction === width) || //if snake hits bottom
      (currentSnake[0] % width === width -1 && direction === 1) || //if snake hits right wall
      (currentSnake[0] % width === 0 && direction === -1) || // if snake hits left wall
      (currentSnake[0] - width < 0 && direction === -width) || // if snake hits top
      squares[currentSnake[0] + direction].classList.contains("snake") // if snake goes into itself 
  ) {
      gameOver = true
      endGame()
  }

  const tail = currentSnake.pop() // Removes last item in array and shows it
  squares[tail].classList.remove("snake") //Removes class of snake from tail
  currentSnake.unshift(currentSnake[0] + direction) // Gives direction to head of array

  if (squares[currentSnake[0]].classList.contains("apple")) {
      squares[currentSnake[0]].classList.remove("apple")
      squares[tail].classList.add("snake")
      currentSnake.push(tail)
      randomApple()
      points++
      score.innerHTML = points
      clearInterval(interval)
      intervalTime = intervalTime * speed
      interval = setInterval(moveOutcomes, intervalTime)
  }
  squares[currentSnake[0]].classList.add("snake")
}

function randomApple() {
  do {
      applePosition = Math.floor(Math.random() * squares.length)
  } while (squares[applePosition].classList.contains("snake"))
  squares[applePosition].classList.add("apple")
}

function turnNorth() {
  squares[currentIndex].classList.remove("snake")
  direction = -width
}

function turnWest() {
  squares[currentIndex].classList.remove("snake")
  direction = -1
}

function turnEast() {
  squares[currentIndex].classList.remove("snake")
  direction = 1
}

function turnSouth() {
  squares[currentIndex].classList.remove("snake")
  direction = +width
}

function control(event) {
  if(event.key === "ArrowRight") {
      direction = 1
  } else if (event.key === "ArrowUp") {
      direction = -width
  } else if (event.key === "ArrowLeft") {
      direction = -1
  } else if (event.key === "ArrowDown") {
      direction = +width
  }
}

function endGame() {
  clearInterval(interval)
  endScore.innerHTML = points
  endTime.innerHTML = timer
  document.querySelector("#game-over").style.display="block"
}

document.addEventListener("keyup", control)
start.addEventListener("click", startGame)