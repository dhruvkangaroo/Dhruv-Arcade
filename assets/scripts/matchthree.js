const gameBoard = document.getElementById("board")
const moveDisplay = document.getElementById("moves")
const scoreDisplay = document.getElementById("score")

const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")

let gameVars = {
    board: [],
    selected: [],
    matches: [],
    score: 0,
    moves: 0,
    size: 8,
}

// Return a random skull (not so random)
const randomSkull = () => {
    return skullArray[Math.floor(Math.random() * skullArray.length)]
}

// Check if can place - for initially creating the array, simple
const canPlaceInitial = (row, col, skullName) => {
    for (let i = col - 1; i >= 0 && gameVars.board[row][i]?.name === skullName; i--) {
        if (col - i >= 2) return false
    }
    for (let i = row - 1; i >= 0 && gameVars.board[i][col]?.name === skullName; i--) {
        if (row - i >= 2) return false
    }
    return true
}

// Create a brand new cell - when initialising the array and replacing cells
const createNewCell = (row, col) => {
    let skull
    do {
        skull = randomSkull()
    } while (!canPlaceInitial(row, col, skull.name))
    const cell = document.createElement("div")
    cell.classList.add("cell")
    cell.dataset.name = skull.name
    cell.style.backgroundImage = `url(${skull.img})`
    cell.dataset.row = row
    cell.dataset.col = col
    cell.addEventListener("click", selectCell)

    return cell
}

// Checking neighbours cells - a little more complex, might swap canPlaceInitial out for this
const checkNeighbours = (cell) => {
    const cellName = cell.name
    const cellRow = parseInt(cell.element.dataset.row, 10)
    const cellCol = parseInt(cell.element.dataset.col, 10)
    let rowNeighbours = [cell]
    let colNeighbours = [cell]

    for (let i = cellCol - 1; i >= 0 && gameVars.board[cellRow]?.[i]?.name === cellName; i--) {
        rowNeighbours.push(gameVars.board[cellRow][i])
    }
    for (let i = cellCol + 1; i < gameVars.size && gameVars.board[cellRow]?.[i]?.name === cellName; i++) {
        rowNeighbours.push(gameVars.board[cellRow][i])
    }
    for (let i = cellRow - 1; i >= 0 && gameVars.board[i]?.[cellCol]?.name === cellName; i--) {
        colNeighbours.push(gameVars.board[i][cellCol])
    }
    for (let i = cellRow + 1; i < gameVars.size && gameVars.board[i]?.[cellCol]?.name === cellName; i++) {
        colNeighbours.push(gameVars.board[i][cellCol])
    }

    if (rowNeighbours.length >= 3 || colNeighbours.length >= 3) {
        return {
            canPlace: false,
            hasMatch: true,
            rowNeighbours: rowNeighbours,
            colNeighbours: colNeighbours
        }
    } else {
        return {
            canPlace: true,
            hasMatch: false,
        }
    }
}

// Creating the initial board array in gameVars
const createBoardArray = () => {
    const totalCells = gameVars.size * gameVars.size
    gameVars.board = Array.from({
        length: gameVars.size
    }, () => Array(gameVars.size).fill(null))

    for (let i = 0; i < totalCells; i++) {
        let row = Math.floor(i / gameVars.size)
        let col = i % gameVars.size

        const cell = createNewCell(row, col)
        gameVars.board[row][col] = {
            element: cell,
            name: cell.dataset.name,
        }
    }
    updateBoard()
}

// Update the game board - just clears and replaces the board on the DOM when needed
const updateBoard = () => {
    gameBoard.innerHTML = ""
    for (let i = 0; i < gameVars.size; i++) {
        for (let j = 0; j < gameVars.size; j++) {
            const cell = gameVars.board[i][j].element
            gameBoard.appendChild(cell)
        }
    }
}

// Selecting cells - if we've two, call checkCells
const selectCell = (e) => {
    const cell = e.target

    if (cell.classList.contains("selected")) {
        cell.classList.remove("selected")
        gameVars.selected = gameVars.selected.filter(item => item != cell)
    } else {
        cell.classList.add("selected")
        gameVars.selected.push(cell)
    }

    if (gameVars.selected.length === 2) {
        checkCells()
    }
}

// Just return coords - should use more
const getCoords = (cell) => {
    return [parseInt(cell.dataset.row, 10), parseInt(cell.dataset.col, 10)]
}

const checkCells = () => {
    const cellOne = gameVars.selected[0]
    const cellOneCoords = getCoords(cellOne)

    const cellTwo = gameVars.selected[1]
    const cellTwoCoords = getCoords(cellTwo)

    const areAdjacent =
        (cellOneCoords[0] === cellTwoCoords[0] && Math.abs(cellOneCoords[1] - cellTwoCoords[1]) === 1) ||
        (cellOneCoords[1] === cellTwoCoords[1] && Math.abs(cellOneCoords[0] - cellTwoCoords[0]) === 1)

    if (areAdjacent) {
        swapCells(cellOneCoords, cellTwoCoords)
    } else {
        cellOne.classList.remove("selected")
        cellTwo.classList.remove("selected")
    }
    gameVars.selected = []
};

// Swapping the cells around, checking for matches
const swapCells = (cellOneCoords, cellTwoCoords) => {
    gameVars.moves += 1
    moveDisplay.innerHTML = gameVars.moves
    const cellOne = gameVars.board[cellOneCoords[0]][cellOneCoords[1]]
    const cellTwo = gameVars.board[cellTwoCoords[0]][cellTwoCoords[1]]
    cellOne.element.dataset.row = cellTwoCoords[0]
    cellOne.element.dataset.col = cellTwoCoords[1]
    cellTwo.element.dataset.row = cellOneCoords[0]
    cellTwo.element.dataset.col = cellOneCoords[1]
    cellOne.element.classList.remove("selected")
    cellTwo.element.classList.remove("selected")

    const updatedGameVars = {
        ...gameVars,
        board: gameVars.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
                if (rowIndex === cellOneCoords[0] && colIndex === cellOneCoords[1]) {
                    return {
                        ...gameVars.board[cellTwoCoords[0]][cellTwoCoords[1]]
                    }
                } else if (rowIndex === cellTwoCoords[0] && colIndex === cellTwoCoords[1]) {
                    return {
                        ...gameVars.board[cellOneCoords[0]][cellOneCoords[1]]
                    }
                } else {
                    return {
                        ...cell
                    }
                }
            })
        )
    }
    
    gameVars = updatedGameVars

    const newCellOne = gameVars.board[cellOneCoords[0]][cellOneCoords[1]]
    const newCellTwo = gameVars.board[cellTwoCoords[0]][cellTwoCoords[1]]

    const checkOne = checkNeighbours(newCellOne)
    const checkTwo = checkNeighbours(newCellTwo)

    if (checkOne.hasMatch) {
        adjustScore(checkOne)
        setTimeout(() => {
            return removeCells(newCellOne, checkOne)
        }, 500)
        
    }
    if (checkTwo.hasMatch) {
        adjustScore(checkTwo)
        setTimeout(() => {
            return removeCells(newCellTwo, checkTwo)
        }, 500)
    }
    
    updateBoard()
}

// Updating the score and adding a matched class for styling
const adjustScore = (cellObjects) => {
    if (cellObjects.rowNeighbours.length >= 3) {
        cellObjects.rowNeighbours.forEach(cell => {
            cell.element.classList.add("matched")
        })
        gameVars.score += cellObjects.rowNeighbours.length
    }
    if (cellObjects.colNeighbours.length >= 3) {
        cellObjects.colNeighbours.forEach(cell => {
            cell.element.classList.add("matched")
        })
        gameVars.score += cellObjects.colNeighbours.length
    }
    scoreDisplay.innerHTML = gameVars.score
}

// Replace matched cells with null then call moveCells
const removeCells = (cell, otherCells) => {
    if (otherCells.rowNeighbours.length >= 3) {
        for (let i = 0; i < otherCells.rowNeighbours.length; i++) {
            const rowCell = otherCells.rowNeighbours[i]
            const rowCellRow = parseInt(rowCell.element.dataset.row, 10)
            const rowCellCol = parseInt(rowCell.element.dataset.col, 10)

            gameVars.board[rowCellRow][rowCellCol] = null
        }
    }
    if (otherCells.colNeighbours.length >= 3) {
        for (let i = 0; i < otherCells.colNeighbours.length; i++) {
            const colCell = otherCells.colNeighbours[i]
            const colCellRow = parseInt(colCell.element.dataset.row, 10)
            const colCellCol = parseInt(colCell.element.dataset.col, 10)

            gameVars.board[colCellRow][colCellCol] = null
        }
    }

    moveCells()
}

// Move cells from higher up the board to the empty spaces
const moveCells = () => {
    for (let row = gameVars.size - 1; row >= 0; row--) {
        for (let col = gameVars.size - 1; col >= 0; col--) {
            if (gameVars.board[row][col] === null) {
                let foundNonNull = false;
                for (let aboveRow = row - 1; aboveRow >= 0; aboveRow--) {
                    if (gameVars.board[aboveRow][col] !== null) {
                        gameVars.board[row][col] = gameVars.board[aboveRow][col]
                        gameVars.board[row][col].element.dataset.row = row
                        gameVars.board[row][col].element.dataset.col = col
                        gameVars.board[aboveRow][col] = null
                        foundNonNull = true
                        break
                    }
                }
                if (!foundNonNull) {
                    const newCell = createNewCell(row, col)
                    gameVars.board[row][col] = {
                        element: newCell,
                        name: newCell.dataset.name
                    }
                }
            }
        }
    }
    updateBoard()
    checkMatches()
}

// Check for matches again once the board has been updated
const checkMatches = () => {
    for (let row = gameVars.size - 1; row >= 0; row--) {
        for (let col = gameVars.size - 1; col >= 0; col--) {
            const cell = gameVars.board[row][col]
            const checkCell = checkNeighbours(cell)
            if (checkCell.hasMatch) {
                adjustScore(checkCell)
                setTimeout(() => {
                    removeCells(cell, checkCell)
                }, 1000)
            }
        }
    }
    updateBoard()
}

const startGame = () => {
    gameBoard.style.gridTemplateColumns = `repeat(${gameVars.size}, 1fr)`
    gameBoard.style.gridTemplateRows = `repeat(${gameVars.size}, 1fr)`
    createBoardArray()
}


startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})

const skullArray = [{
        name: "owl",
        img: "../assets/images/memory-cards/owl.webp"
    },
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
        name: "lion",
        img: "../assets/images/memory-cards/lion.webp",
    },
    {
        name: "deer",
        img: "../assets/images/memory-cards/deer.webp",
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
        name: "walrus",
        img: "../assets/images/memory-cards/walrus.webp",
    },
]