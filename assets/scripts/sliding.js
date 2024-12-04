/* Puzzles! */
const EASY = [{
    name: "turtle",
    images: ["../assets/images/sliding/turt-1.png", "../assets/images/sliding/turt-2.png", "../assets/images/sliding/turt-3.png", "../assets/images/sliding/turt-4.png", "../assets/images/sliding/turt-5.png", "../assets/images/sliding/turt-6.png", "../assets/images/sliding/turt-7.png", "../assets/images/sliding/turt-8.png"]
}]

const HARD = [{
    name: "turtle-hard",
    images: ["../assets/images/sliding/orc-hard-1.png", "../assets/images/sliding/orc-hard-2.png", "../assets/images/sliding/orc-hard-3.png", "../assets/images/sliding/orc-hard-4.png", "../assets/images/sliding/orc-hard-5.png", "../assets/images/sliding/orc-hard-6.png", "../assets/images/sliding/orc-hard-7.png", "../assets/images/sliding/orc-hard-8.png", "../assets/images/sliding/orc-hard-9.png", "../assets/images/sliding/orc-hard-10.png", "../assets/images/sliding/orc-hard-11.png", "../assets/images/sliding/orc-hard-12.png", "../assets/images/sliding/orc-hard-13.png", "../assets/images/sliding/orc-hard-14.png", "../assets/images/sliding/orc-hard-15.png",]
}]

/* Our HTML elements */
const startEasyBtn = document.getElementById("start-easy")
const startHardBtn = document.getElementById("start-hard")
const resetBtn = document.getElementById("reset")
const cantMove = document.getElementById("cant-move")
const board = document.getElementById("puzzle")
const grid = document.createElement("div")
let timeDisplay = document.getElementById("timer")

/* Variables */
let time = 0
let gameOver = false
let size = ""
let correctOrder = []

/**
 * createBoard function - called by startGame()
 * Select the puzzle based on size / difficulty selected by user
 * Save the correct order to correctOrder array
 * Create the tiles, push to currentPuzzle array and send this to shufflePuzzle()
 */
function createBoard() {
    let puzzle = {}
    let currentPuzzle = []

    if (size == "small") {
        puzzle = EASY[Math.floor(Math.random() * EASY.length)]
    }

    if (size == "big") {
        puzzle = HARD[Math.floor(Math.random() * HARD.length)]
    }

    correctOrder = puzzle.images
    puzzle.images.forEach((image) => {
        const tile = document.createElement("div")
        if (size == "small") {
            tile.classList.add("tile", "easy")
        } else {
            tile.classList.add("tile", "hard")
        }

        tile.addEventListener("click", moveTile)

        const face = document.createElement("div")

        face.classList.add("face")
        face.style.backgroundImage = `url(${image})`

        currentPuzzle.push(tile)
        tile.appendChild(face)
    })
    const emptyTile = document.createElement("div")
    if (size == "small") {
        emptyTile.classList.add("tile", "easy", "empty")
    } else {
        emptyTile.classList.add("tile", "hard", "empty")
    }
    currentPuzzle.push(emptyTile)
    shufflePuzzle(currentPuzzle)
}

/**
 * @param {array} currentPuzzle - array of tiles from createBoard()
 * Need the puzzle to be solveable - can't just shuffle images randomly
 * Makes an arbitrary number of moves to shuffle the tiles in the array
 * Then appends the tiles to the grid
 */
function shufflePuzzle(currentPuzzle) {
    let moves = 0
    let gridSize
    if (size == "small") {
        gridSize = 3
    } else {
        gridSize = 4
    }

    while (moves < 50) {
        let randomTile = Math.floor(Math.random() * currentPuzzle.length)
        let emptyTile = currentPuzzle.findIndex(tile => tile.classList.contains("empty"))
        let move = findMove(randomTile, emptyTile, gridSize)
        if (move != "no") {
            [currentPuzzle[randomTile], currentPuzzle[emptyTile]] = [currentPuzzle[emptyTile], currentPuzzle[randomTile]]
            moves += 1
        }        
    }
    currentPuzzle.forEach((tile) => {
        grid.appendChild(tile)
    })
}

/**
 * Determines whether the selected tile can move to the empty space
 * @param {integer} tile - index of the tile we want to move
 * @param {integer} emptyTile - index of the empty tile
 * @param {integer} gridSize - size of the grid
 * @returns where the tile we want to move can move or that it cannot move
 */
function findMove(tile, emptyTile, gridSize) {
    if (tile - gridSize == emptyTile) {
        return "above"
    } else if (tile + gridSize == emptyTile) {
        return "below"
    } else if (tile - 1 == emptyTile) {
        return "left"
    } else if (tile + 1 == emptyTile) {
        return "right"
    } else {
        return "no"
    }
}

/**
 * @param {*} event - targeting the backgroundImage of the clicked tile
 * Find the index of the selected tile, then call findMove to see if we can move it
 * If not - display warning to user
 * If so:
 * @returns redrawBoard() with our current array of tiles, and the index of the selected and empty tiles 
 */
function moveTile(event) {
    let gridSize = 0
    let tiles = Array.from(document.getElementsByClassName("tile"))
    let emptyTile = tiles.findIndex(tile => tile.classList.contains("empty"))
    let selectedTile = tiles.findIndex((tile) => {
        if (tile.firstChild) {
            if (tile.firstChild.style.backgroundImage == event.target.style.backgroundImage) {
                return tile
            }
        }
    })
    // Maybe consider making gridSize global as doing the same thing in a couple functions
    if (size == "small") {
        gridSize = 3
    } else {
        gridSize = 4
    }
    let move = findMove(selectedTile, emptyTile, gridSize)
    if (move === "no") {
        cantMove.style.display = "block"
        setTimeout(function () {
            cantMove.style.display = "none"
        }, 500)
    } else {
        return redrawBoard(tiles, selectedTile, emptyTile)
    }
}

/**
 * Swap our selected and empty tiles, clear board and append tiles again
 * @param {array} tiles - current array of our tiles
 * @param {integer} tile - index of selected tile
 * @param {integer} emptyTile - index of empty tile
 * Also call checkWin with our tiles array
 */
function redrawBoard(tiles, tile, emptyTile) {
    [tiles[tile], tiles[emptyTile]] = [tiles[emptyTile], tiles[tile]]
    grid.innerHTML = ""
    tiles.forEach((tile) => {
        grid.appendChild(tile)
    })
    checkWin(tiles)
}

/**
 * Check if the puzzle is solved
 * @param {array} tiles 
 * We're comparing based on the order of the image URLs originally saved in correctOrder
 * Our current tiles array is an array of DOM elements - so we need to iterate through
 * each of those tiles and just get the backgroundImage URLs for each of those
 * We push them to currentOrder (pop off the (possibly) empty tile at the end)
 * Then if checkArrays returns true we end our game!
 */
function checkWin(tiles) {
    let currentOrder = []
    tiles.forEach((tile) => {
        if (tile.firstChild) {
            image = tile.firstChild.style.backgroundImage.slice(4, -1).replace(/"/g, "")
            currentOrder.push(image)
        } else {
            currentOrder.push("blank")
        }
    })
    currentOrder.pop()
    if (checkArrays(correctOrder, currentOrder)) {
        document.getElementById("game-over").style.display = "block"
        document.getElementById("result").innerHTML = "WON!"
        document.getElementById("end-time").innerHTML = time
        gameOver = true
    }
}

/**
 * https://bobbyhadz.com/blog/javascript-check-if-two-arrays-have-same-elements
 * Bobby Hadz has a nice function for making sure two arrays are identical
 * Checks if arrays are same length and same order, iterating through the arrays
 * with the every() method checking if elements are identical at each index
 * @param {array} array1 
 * @param {array} array2 
 * @returns boolean
 */
function checkArrays(correctOrder, currentOrder) {
    if (correctOrder.length === currentOrder.length) {
        return correctOrder.every((element, index) => {
            if (element === currentOrder[index]) {
                return true;
            }
            return false;
        });
    }
    return false;
}

/**
 * Currently called by users clicking "Start Easy" button
 * Could consider a radio button on HTML and have one start function that takes
 * the value to determine settings??
 * Adds small class to grid, sets size variable to small and calls startGame()
 */
function startEasy() {
    grid.classList.add("grid", "small")
    board.appendChild(grid)
    size = "small"
    startGame()
}

/**
 * Currently called by users clicking "Start Hard" button
 * Adds big class to grid, sets size variable to big and calls startGame()
 */
function startHard() {
    grid.classList.add("grid", "big")
    board.appendChild(grid)
    size = "big"
    startGame()
}

/**
 * Starts the timer, removes start button event listeners
 * Calls createBoard()
 */
function startGame() {
    let startTime = setInterval(() => {
        time++
        timeDisplay.innerHTML = time
        if (gameOver) {
            time = 0
            clearInterval(startTime)
        }
    }, 1000)
    startEasyBtn.removeEventListener("click", startEasy)
    startHardBtn.removeEventListener("click", startHard)
    createBoard()
}

startEasyBtn.addEventListener("click", startEasy)
startHardBtn.addEventListener("click", startHard)
reset.addEventListener("click", () => {
    location.reload() 
  })