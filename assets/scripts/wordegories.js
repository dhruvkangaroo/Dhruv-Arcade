const gameBoard = document.getElementById("game")
const correctCats = document.getElementById("correct-categories")
const message = document.getElementById("message")

const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")
const guessBtn = document.getElementById("guess-button")

const gameVars = {
    "categories": [],
    "difficulty": 3,
    "chances": 3,
    "selected": [],
    "correct": 0
}

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const selectCategories = (difficulty) => {
    const shuffledCategories = shuffle([...categories])
    gameVars["categories"] = shuffledCategories.slice(0, difficulty)
}

const selectWord = (e) => {
    const selectedBtn = e.target

    if (selectedBtn.classList.contains("selected")) {
        selectedBtn.classList.remove("selected")
        gameVars["selected"] = gameVars["selected"].filter(word => {
            return word != selectedBtn.innerHTML
        })
    } else {
        selectedBtn.classList.add("selected")
        gameVars["selected"].push(selectedBtn.innerHTML)
    }
}

const checkGuess = () => {
    if (gameVars["selected"].length != 4) {
        displayMessage("Please select 4 words")
        return false
    } else {
        const sortedSelected = gameVars["selected"].slice().sort()
        for (let category of gameVars["categories"]) {
            const sortedCat = category["words"].slice().sort()
            if (sortedSelected.every((value, index) => value === sortedCat[index])) {
                displayMessage("Correct!")
                return category
            }
        }
        displayMessage("Not a match...")
        gameVars["chances"] -= 1
        document.getElementById("chances").innerHTML = gameVars["chances"]
        return false
    }
}

const submitGuess = () => {
    const category = checkGuess()
    if (category) {
        gameVars["correct"] += 1
        const catDiv = document.createElement("div")
        catDiv.classList.add("category-display")
        const theme = document.createElement("p")
        theme.innerHTML = category["theme"]
        catDiv.appendChild(theme)
        const words = document.createElement("p")
        words.innerHTML = category["words"].join(", ")
        catDiv.appendChild(words)
        correctCats.appendChild(catDiv)

        const wordBtns = document.querySelectorAll(".word-button")

        Array.from(wordBtns).filter(btn => btn.classList.contains("selected")).forEach(btn => btn.remove())
    } else {
        const selectedBtns = document.querySelectorAll(".selected")
        for (let btn of selectedBtns) {
            btn.classList.remove("selected")
        }
    }

    gameVars["selected"] = []
    checkEnd()
}

const checkEnd = () => {
    console.log("checking")
    if (gameVars["difficulty"] == gameVars["correct"]) {
        console.log("won")
        document.getElementById("game-over").style.display = "block"
        document.getElementById("result").innerHTML = "found all the matches!"
    } else if (gameVars["chances"] == 0) {
        console.log(lost)
        document.getElementById("game-over").style.display = "block"
        document.getElementById("result").innerHTML = "didn't find all the matches..."
    }
}

const buildBoard = () => {
    let allWords = []
    gameVars["categories"].forEach(category => {
        for (let word of category["words"]) {
            allWords.push(word)
        }
    })

    allWords = shuffle(allWords)

    gameBoard.style.gridTemplateColumns = `repeat(4, 1fr)`
    gameBoard.style.gridTemplateRows = `repeat(${gameVars["difficulty"]}, 1fr)`

    for (let i = 0; i < allWords.length; i++) {
        const wordBtn = document.createElement("button")
        wordBtn.innerHTML = allWords[i]
        wordBtn.classList.add("word-button")
        wordBtn.addEventListener("click", selectWord)
        gameBoard.appendChild(wordBtn)
    }
}

const displayMessage = (text) => {
    message.innerHTML = text
    setTimeout(() => {
        message.innerHTML = ""
    }, 500)
}

const startGame = () => {
    startBtn.removeEventListener("click", startGame)
    gameVars["difficulty"] = parseInt(document.querySelector("input[name='categories']:checked").value)
    selectCategories(gameVars["difficulty"])

    buildBoard()

    guessBtn.style.display = "block"
    guessBtn.addEventListener("click", submitGuess)
}

guessBtn.style.display = "none"
startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})

const categories = [
    {
        "theme": "Words beginning with 'mid'",
        "words": ["night", "term", "range", "day"]
    },
    {
        "theme": "Stomach chambers",
        "words": ["rumen", "reticulum", "omasum", "abomasum"]
    },
    {
        "theme": "Types of bird",
        "words": ["tit", "grackle", "warbler", "shag"]
    },
    {
        "theme": "Units of time",
        "words": ["second", "minute", "hour", "fortnight"]
    },
    {
        "theme": "Elements",
        "words": ["neon", "lead", "nitrogen", "helium"]
    },
    {
        "theme": "Shades of blue",
        "words": ["azure", "cobalt", "teal", "navy"]
    },
    {
        "theme": "Programming languages",
        "words": ["c", "python", "ruby", "javascript"]
    },
    {
        "theme": "Types of snake",
        "words": ["copperhead", "cottonmouth", "boa", "python"]
    },
]