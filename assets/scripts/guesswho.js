const CHARACTERS = [
    {
        name: "alice",
        image: "../assets/images/guesswho/alice.png",
        description: ["blonde hair", "blond hair", "brown eyes", "medium hair", "medium length hair", "glasses"],
    },
    {
        name: "anna",
        image: "../assets/images/guesswho/anna.png",
        description: ["grey hair", "green eyes", "long hair"],
    },
    {
        name: "betty",
        image: "../assets/images/guesswho/betty.png",
        description: ["brown hair", "blue eyes", "medium hair", "medium length hair", "glasses"],
    },
    {
        name: "carl",
        image: "../assets/images/guesswho/carl.png",
        description: ["blonde hair", "blond hair", "brown eyes", "short hair"],
    },
    {
        name: "don",
        image: "../assets/images/guesswho/don.png",
        description: ["blonde hair", "blond hair", "medium hair", "medium length hair", "brown eyes", "glasses"],
    },
    {
        name: "erica",
        image: "../assets/images/guesswho/erica.png",
        description: ["blonde hair", "blond hair", "long hair", "blue eyes"],
    },
    {
        name: "fred",
        image: "../assets/images/guesswho/fred.png",
        description: ["black hair", "short hair", "blue eyes"],
    },
    {
        name: "george",
        image: "../assets/images/guesswho/george.png",
        description: ["no hair", "bald", "bald hair", "grey eyes", "beard", "a beard", "moustache", "a moustache"],
    },
    {
        name: "jack",
        image: "../assets/images/guesswho/jack.png",
        description: ["grey hair", "green eyes", "glasses", "beard", "a beard", "moustache", "a moustache"],
    },
    {
        name: "james",
        image: "../assets/images/guesswho/james.png",
        description: ["no hair", "bald", "bald hair", "blue eyes", "moustache", "a moustache"],
    },
    {
        name: "jane",
        image: "../assets/images/guesswho/jane.png",
        description: ["black hair", "short hair", "blue eyes"],
    },
    {
        name: "jerry",
        image: "../assets/images/guesswho/jerry.png",
        description: ["no hair", "bald", "bald hair", "grey eyes"],
    },
    {
        name: "joanne",
        image: "../assets/images/guesswho/joanne.png",
        description: ["black hair", "long hair", "green eyes"],
    },
    {
        name: "leslie",
        image: "../assets/images/guesswho/leslie.png",
        description: ["blonde hair", "blond hair", "short hair", "blue eyes"],
    },
    {
        name: "linda",
        image: "../assets/images/guesswho/linda.png",
        description: ["black hair", "short hair", "brown eyes"],
    },
    {
        name: "lisa",
        image: "../assets/images/guesswho/lisa.png",
        description: ["brown hair", "long hair", "brown eyes", "glasses"],
    },
    {
        name: "nancy",
        image: "../assets/images/guesswho/nancy.png",
        description: ["grey hair", "long hair", "grey eyes", "glasses"],
    },
    {
        name: "nicole",
        image: "../assets/images/guesswho/nicole.png",
        description: ["grey hair", "short hair", "brown eyes"],
    },
    {
        name: "paul",
        image: "../assets/images/guesswho/paul.png",
        description: ["brown hair", "medium hair", "medium length hair", "grey eyes", "beard", "a beard", "moustache", "a moustache", "glasses"],
    },
    {
        name: "pete",
        image: "../assets/images/guesswho/pete.png",
        description: ["brown hair", "short hair", "brown eyes"],
    },
    {
        name: "robert",
        image: "../assets/images/guesswho/robert.png",
        description: ["black hair", "long hair", "blue eyes", "moustache", "a moustache", "beard", "a beard", "glasses"],
    },
    {
        name: "sally",
        image: "../assets/images/guesswho/sally.png",
        description: ["brown hair", "short hair", "grey eyes"],
    },
    {
        name: "sean",
        image: "../assets/images/guesswho/sean.png",
        description: ["brown hair", "short hair", "green eyes", "moustache", "a moustache", "glasses"],
    },
    {
        name: "steve",
        image: "../assets/images/guesswho/steve.png",
        description: ["no hair", "bald", "bald hair", "green eyes", "moustache", "a moustache"],
    },
]

const startButton = document.getElementById("start")
const resetButton = document.getElementById("reset")
const autoflipBtn = document.getElementById("autoflip")
const autoflipOn = document.getElementById("autoflip-on")
const guessDisplay = document.getElementById("guess-area")
const finalGuessDisplay = document.getElementById("final-guess-area")
const showFinalGuess = document.getElementById("show-final-guess")
const finalGuessInput = document.getElementById("final-guess")
const clueInput = document.getElementById("user-guess")
const clueBtn = document.getElementById("guess-button")
const finalGuessBtn = document.getElementById("final-guess-button")
const ansDisplay = document.getElementById("answer-display")
const clueAns = document.getElementById("clue-answer")
const board = document.getElementById("characters")
const grid = document.createElement("div")
grid.classList.add("grid")
board.appendChild(grid)

let thePerson = {}
let clues = []
let autoflip = false

autoflipBtn.addEventListener("click", () => {
    autoflip = autoflip ? false : true
    console.log(autoflip)
    if (autoflip) {
        autoflipOn.style.display = "inline"
    } else {
        autoflipOn.style.display = "none"
    }
})

function createBoard() {
    CHARACTERS.sort(() => 0.5 - Math.random())
    CHARACTERS.forEach((char) => {
        const card = document.createElement("div")
        card.classList.add("card")
        card.dataset.name = char.name
        card.addEventListener("click", flipCard)

        const frontFace = document.createElement("div")
        frontFace.classList.add("front-face")
        frontFace.style.backgroundImage = `url(${char.image})`
        
        const charName = document.createElement("p")
        charName.classList.add("char-name")
        charName.innerHTML = `${char.name.charAt(0).toUpperCase() + char.name.slice(1)}`

        const backFace = document.createElement("div")
        backFace.classList.add("back-face")

        grid.appendChild(card)
        card.appendChild(frontFace)
        frontFace.appendChild(charName)
        card.appendChild(backFace)
    }) 
}

function flipCard() {
    this.classList.toggle("flip")
}

clueBtn.addEventListener("click", getClue)
function getClue() {
    let cards = Array.from(document.getElementsByClassName("card"))
    let guessRight = true
    let guess = clueInput.value.trim().toLowerCase()
    ansDisplay.style.display = "block"
    if (thePerson.description.includes(guess)) {
        clueAns.innerHTML = `does have ${guess}`
        guessRight = true
    } else {
        clueAns.innerHTML = `does not have ${guess}`
        guessRight = false
    }
    if (autoflip) {
        if (guessRight) {
            CHARACTERS.forEach((char) => {
                if (!char.description.includes(guess)) {
                    cards.forEach((card) => {
                        console.log(card)
                        if (card.getAttribute("data-name") == char.name) {
                            card.classList.add("flip")
                        }                        
                    })
                }
            })
        } else {
            CHARACTERS.forEach((char) => {
                if (char.description.includes(guess)) {
                    cards.forEach((card) => {
                        console.log(card)
                        if (card.getAttribute("data-name") == char.name) {
                            card.classList.add("flip")
                        }                        
                    })
                }
            })
        }
    }
    clueInput.value = ""
}

function showFinal() {
    finalGuessDisplay.style.display = "block"
    finalGuessBtn.addEventListener("click", finalGuess)
}

function finalGuess() {
    let guessChar = finalGuessInput.value.trim().toLowerCase()
    checkWin(guessChar)
}

function checkWin(guess) {
    document.getElementById("game-over").style.display = "block"
    document.getElementById("correct-person").innerHTML = `${thePerson.name.charAt(0).toUpperCase() + thePerson.name.slice(1)}`
    document.getElementById("correct-image").style.backgroundImage = `url(${thePerson.image})`
    if (thePerson.name == guess) {
        document.getElementById("result").innerHTML = "WON!"
    } else {
        document.getElementById("result").innerHTML = "LOST!"
    }
}

function startGame() {
    startButton.removeEventListener("click", startGame)
    // Get the Person
    thePerson = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
    console.log(thePerson.description)
    // Create the board
    createBoard()
    // Show guess input
    guessDisplay.style.display = "block"
    showFinalGuess.style.display = "block"
    showFinalGuess.addEventListener("click", showFinal)
}

startButton.addEventListener("click", startGame)
resetButton.addEventListener("click", () => {
    location.reload()
})
