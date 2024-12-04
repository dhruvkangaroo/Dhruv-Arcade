const wordGrid = document.getElementById("word-grid")
const guessInput = document.getElementById("guess-input")
const keyboard = document.getElementById("keyboard")

const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")
const guessBtn = document.getElementById("guess-button")

const gameVars = {
    "length": 0,
    "guesses": [],
    "word": ""
}

let lastKeyPressed = null;

document.addEventListener('keydown', (e) => {
    lastKeyPressed = e.key
});

let lastSelectedInput = null

document.addEventListener('mousedown', (e) => {
    if (e.target.tagName === "INPUT") {
        lastSelectedInput = e.target
    }
})

const moveFocus = (input) => {

}

const checkInput = (e) => {
    const input = e.target
    if ((/[^a-zA-Z]/g).test(input.value)){
        return input.value = input.value.replace(/[^a-zA-Z]/g, '')
    }
    let newValue = input.value.slice(-1)
    if ((/^[a-z]$/.test(newValue))) {
        newValue = newValue.toUpperCase()
        lastKeyPressed = "Delete"
    }
    input.value = newValue
    if (input.nextSibling && input.nextSibling.tagName == "INPUT" && lastKeyPressed != "Delete" && lastKeyPressed != "Backspace") {
        input.nextSibling.focus()
        lastSelectedInput = input.nextSibling
    }
}

const inputKey = (e) => {
    const letter = e.target.innerHTML

    if (lastSelectedInput) {
        lastSelectedInput.value = letter
        const event = new Event('input');
        lastSelectedInput.dispatchEvent(event);
    }
}

const createKeyboard = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    for (let i = 0; i < alphabet.length; i++) {
        const key = document.createElement("button")
        key.innerHTML = alphabet[i]
        key.classList.add("cell", "key")
        key.addEventListener("click", inputKey)
        keyboard.appendChild(key)
    }
}

const getLength = () => {
    return parseInt(document.querySelector("input[name='word-length']:checked").value)
}

const renderGame = (length) => {
    wordGrid.innerHTML = ""

    wordGrid.style.gridTemplateColumns = `repeat(${length}, 1fr)`
    wordGrid.style.gridTemplateRows = `repeat(${length}, 1fr)`

    const totalCells = length * length;
    for (let i = 0; i < totalCells; i++) {
        const gridCell = document.createElement('div')
        gridCell.classList.add("grid-cell", "cell")
        wordGrid.appendChild(gridCell)
    }

    for (let i = 1; i <= length; i++) {
        const guessCell = document.createElement('input')
        guessCell.type = "text"
        guessCell.name = "guess"
        guessCell.maxLength = 1
        guessCell.classList.add("cell", "guess-cell")
        guessCell.addEventListener("input", checkInput)
        guessInput.appendChild(guessCell)
    }

    lastSelectedInput = document.querySelectorAll(".guess-cell")[0]

    createKeyboard()
}

const pickWord = (length) => {
    if (length == 3) {
        return threeLetters[Math.floor(Math.random() * threeLetters.length)].toUpperCase()
    } else if (length == 4) {
        return fourLetters[Math.floor(Math.random() * fourLetters.length)].toUpperCase()
    } else {
        return fiveLetters[Math.floor(Math.random() * fiveLetters.length)].toUpperCase()
    }
}

const checkGuess = () => {
    guessBtn.removeEventListener("click", checkGuess)
    let guess = ""
    let correct = 0
    
    const guessCells = document.querySelectorAll(".guess-cell")    
    guessCells.forEach(cell => guess += cell.value)

    if (guess.length != gameVars["word"].length) {
        return console.log("wrong length")
    }

    const gridCells = document.querySelectorAll(".grid-cell")
    let emptyGridCells = Array.from(gridCells).filter(cell => cell.innerHTML === "");

    for (let i = 0; i < guess.length; i++) {
        const cell = emptyGridCells[i];
        const guessedLetter = guess[i];
        
        if (gameVars["word"][i] === guessedLetter) {
            cell.classList.add("correct-place");
            correct++;
        } else if (gameVars["word"].includes(guessedLetter)) {
            cell.classList.add("correct-letter");
        } else {
            cell.classList.add("wrong-letter");
        }
        
        cell.innerHTML = guessedLetter;
    }

    gameVars["guesses"].push(guess)
    
    guessCells.forEach(cell => cell.value = "");
    lastSelectedInput = document.querySelectorAll(".guess-cell")[0]


    setTimeout(() => {
        if (correct === gameVars["word"].length) {
            document.getElementById("game-over").style.display = "block"
            document.getElementById("result").innerHTML = "WON!"
            document.getElementById("right-word").innerHTML = gameVars["word"]
        } else if (gameVars["length"] == gameVars["guesses"].length) {
            document.getElementById("game-over").style.display = "block"
            document.getElementById("result").innerHTML = "lost..."
            document.getElementById("right-word").innerHTML = gameVars["word"]
        } else {
            guessBtn.addEventListener("click", checkGuess)
        }
    }, 500)
}

const startGame = () => {
    startBtn.removeEventListener("click", startGame)
    gameVars["length"] = getLength()
    renderGame(gameVars["length"])
    gameVars["word"] = pickWord(gameVars["length"])
    guessBtn.addEventListener("click", checkGuess)
    guessBtn.style.display = "block"
}

guessBtn.style.display = "none"
startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})


const threeLetters = ["not", "net", "the", "yes", "ate", "new", "fin", "fit", "fat", "ten", "tic", "toc", "ton", "she", "her", "him", "hot", "his", "hat", "day", "son", "sin", "sun", "set", "sat", "sit", "sum", "sad", "men", "man", "mic", "mad"]

const fourLetters = ["thin", "then", "than", "tone", "tune", "that", "they", "them", "sent", "send", "sand", "sign", "sing", "yell", "bang", "tell", "bent", "days", "week", "weak", "tall", "feel", "felt", "yelp", "sumo", "song", "sang"]

const fiveLetters = ["their", "yells", "theme", "tunes", "tones", "tuner", "sings", "songs", "signs", "human", "catch", "canoe", "banjo", "bangs", "bingo", "bento", "weeks", "weird", "waste", "waist", "shame", "feels", "cause"]