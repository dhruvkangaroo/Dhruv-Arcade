const guessDisplay = document.getElementById("guesses")
const livesDisplay = document.getElementById("lives")
const pictureDisplay = document.getElementById("picture")
const wordDisplay = document.getElementById("word-display")
const userGuess = document.getElementById("guess-input")
const guessBtn = document.getElementById("guess-button")
const messageDisplay = document.getElementById("message")
const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")

const gameVars = {
    word: "",
    lives: 8,
    pictureIndex: 0,
    guesses: [],
    gameOver: false,
    gameWon: false
}

const setPicture = () => {
    pictureDisplay.src = `../assets/images/hangman/hangman${gameVars.pictureIndex}.png`
}

const getWord = () => {
    let wordLength = Math.floor(Math.random() * (10 - 6) + 6)
    console.log(wordLength)
    fetch(`https://random-word-api.herokuapp.com/word?length=${wordLength}`) 
        .then(response => { 
            if (response.ok) { 
                return response.json()
            } else { 
                throw new Error("Request failed") 
            } 
        }) 
        .then(word => { 
            console.log(word)
            gameVars.word = word[0]
            displayWord()
        }) 
        .catch(error => { 
            console.error(error)
        });
}

const displayWord = () => {
    let hiddenWord = ""
    for (let i = 0; i < gameVars.word.length; i++) {
        console.log(i)
        if (gameVars.guesses.includes(gameVars.word.charAt(i))) {
            hiddenWord += gameVars.word.charAt(i)
        } else {
            hiddenWord += "_"
        }
    }
    if (!hiddenWord.includes("_")) {
        gameVars.gameWon = true
        checkEnd()
    }
    console.log(hiddenWord)
    wordDisplay.innerHTML = hiddenWord
}

const getGuess = () => {
    let alphabet = /^[a-zA-Z]+$/
    let guess = userGuess.value
    guess.toLowerCase()
    console.log(guess)
    console.log(alphabet.test(guess))
    if (gameVars.guesses.includes(guess)) {
        messageDisplay.innerHTML = `You guessed ${guess} already!`
    } else if (alphabet.test(guess)) {
        gameVars.guesses.push(guess)
        gameVars.guesses.sort()
        checkGuess(guess)
    } else {
        messageDisplay.innerHTML = "Guesses must be letters!"
    }
    userGuess.value = ""
}

const checkGuess = (guess) => {
    if (gameVars.word.includes(guess)) {
        messageDisplay.innerHTML = `${guess} is in the word!`
    } else {
        messageDisplay.innerHTML = `${guess} is not in the word!`
        gameVars.pictureIndex += 1
        gameVars.lives -= 1
        setPicture()
        livesDisplay.innerHTML = gameVars.lives
    }
    let guessList = ""
    for (let letter of gameVars.guesses) {
        guessList += `${letter}, `
    }
    guessDisplay.innerHTML = guessList
    checkEnd()
}

const checkEnd = () => {
    if (gameVars.lives == 0) {
        setTimeout(() => {
            document.querySelector("#game-over").style.display = "block"
            document.querySelector("#end-word").innerHTML = gameVars.word.toUpperCase()
            document.querySelector("#result").innerHTML = "lost :("
        }, 1000)
    } else if (gameVars.gameWon) {
        setTimeout(() => {
            document.querySelector("#game-over").style.display = "block"
            document.querySelector("#end-word").innerHTML = gameVars.word.toUpperCase()
            document.querySelector("#result").innerHTML = "WON!"            
        }, 1000)
    } else {
        displayWord()
    }
}

const startGame = () => {
    document.getElementById("board").style.display = "flex"
    document.getElementById("start-game").style.display = "none"
    guessBtn.addEventListener("click", getGuess)
    setPicture()
    getWord()
}

startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})