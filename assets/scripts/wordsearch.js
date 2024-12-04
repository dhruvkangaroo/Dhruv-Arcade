const gameGrid = document.getElementById("game")
const message = document.getElementById("message")

const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")

const gameVars = {
    "size": 10,
    "theme": {},
    "selected": [],
    "directions": {
        "l-r": [0, 1],
        "r-l": [0, -1],
        "t-b": [1, 0],
        "b-t": [-1, 0],
        "t-r-d": [1, 1],
        "b-r-d": [-1, 1],
        "t-l-d": [1, -1],
        "b-l-d": [-1, -1]
    },
    "found": [],
    "boardArray": Array.from({ length: 10 }, () => Array(10).fill(''))
}

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function canPlaceWord(word, row, col, direction) {
    const [rowDir, colDir] = gameVars["directions"][direction]

    let endRow = row + (word.length - 1) * rowDir
    let endCol = col + (word.length - 1) * colDir

    if (endRow < 0 || endRow >= gameVars["size"] || endCol < 0 || endCol >= gameVars["size"]) {
        return false
    }

    for (let i = 0; i < word.length; i++) {
        let curRow = row + i * rowDir
        let curCol = col + i * colDir
        if (gameVars["boardArray"][curRow][curCol] !== "") {
            return false
        }
    }

    return true
}

function placeWord(word, row, col, direction) {
    const [rowDir, colDir] = gameVars["directions"][direction]

    for (let i = 0; i < word.length; i++) {
        let curRow = row + i * rowDir
        let curCol = col + i * colDir
        gameVars["boardArray"][curRow][curCol] = word[i]
    }
}

function fillEmptyCells() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    for (let row = 0; row < gameVars["size"]; row++) {
        for (let col = 0; col < gameVars["size"]; col++) {
            if (gameVars["boardArray"][row][col] === "") {
                gameVars["boardArray"][row][col] = alphabet[Math.floor(Math.random() * alphabet.length)]
            }
        }
    }
}

const renderGrid = () => {
    const directions = ["l-r", "r-l", "t-b", "b-t", "t-r-d", "b-r-d", "t-l-d", "b-l-d"]

    gameGrid.style.gridTemplateColumns = `repeat(${gameVars["size"]}, 1fr)`
    gameGrid.style.gridTemplateRows = `repeat(${gameVars["size"]}, 1fr)`

    for (let word of gameVars["theme"]["words"]) {
        let placed = false

        while (!placed) {
            const randomRow = Math.floor(Math.random() * gameVars["size"])
            const randomCol = Math.floor(Math.random() * gameVars["size"])
            let direction = directions[Math.floor(Math.random() * directions.length)]

            if (canPlaceWord(word, randomRow, randomCol, direction)) {
                placeWord(word, randomRow, randomCol, direction)
                placed = true
            }
        }
    }

    fillEmptyCells()

    gameVars["boardArray"].forEach(row => {
        row.forEach(cell => {
            const div = document.createElement("div")
            div.classList.add("grid-cell", "selectable")
            div.textContent = cell
            div.addEventListener("click", selectCell)
            gameGrid.appendChild(div)
        })
    })
}

const selectCell = (e) => {
    const selected = e.target
    const currentWord = gameVars["found"].length.toString()

    if (!selected.classList.contains("locked")){
        if (!selected.classList.contains("selected") && !selected.classList.contains(`${currentWord}`)) {
            selected.classList.add("selected", currentWord)
            gameVars["selected"] += selected.innerHTML
        } else {
            selected.classList.remove("selected", currentWord)
            gameVars["selected"] = gameVars["selected"].replace(selected.innerHTML, "")
        }
    }

    const selectedWord = gameVars["selected"].split().sort().join("")
    for (let word of gameVars["theme"]["words"]) {
        const themeWord = word.split().sort().join()
        if (themeWord === selectedWord) {
            gameVars["found"].push(word)
            document.getElementById("correct-words").innerHTML = gameVars["found"].join(", ")
            gameVars["selected"] = ""
            lockLetters()
        }
    }

    if (gameVars["found"].length === gameVars["theme"]["words"].length) {
        document.getElementById("game-over").style.display = "block"
    }

    console.log(gameVars["selected"])
}

const lockLetters = () => {
    const cells = document.querySelectorAll(".selected")
    for (let cell of cells) {
        if (!cell.classList.contains("locked")) {
            cell.classList.add("locked")
        }
    }
}

const displayMessage = (text) => {
    message.innerHTML = text
}

const startGame = () => {
    startBtn.removeEventListener("click", startGame)

    const shuffledGroups = shuffle([...wordArray])

    gameVars["theme"] = shuffledGroups.slice(0, 1)[0]

    document.getElementById("category").innerHTML = gameVars["theme"]["theme"]

    renderGrid()
}


startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})

const wordArray = [{
        "theme": "Parts of the body",
        "words": ["ligament", "stomach", "tendon", "finger", "heart", "head", "hand", "knee", "eye", "ear"]
    },
    {
        "theme": "Measurements of time",
        "words": ["fortnight", "century", "minute", "second", "decade", "month", "week", "year", "hour", "day"]
    },
    {
        "theme": "Periodic elements",
        "words": ["nitrogen", "bismuth", "sulfur", "helium", "argon", "boron", "xenon", "lead", "neon", "tin"]
    },
    {
        "theme": "Video games",
        "words": ["infamous", "simcity", "fallout", "tetris", "pacman", "bully", "contra", "snake", "myst", "pong"]
    },
]