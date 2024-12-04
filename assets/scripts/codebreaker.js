const guessInputs = document.querySelectorAll(".user-guess")
const guessBtn = document.getElementById("guess-button")
const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")

let lives = 5
let wrong = 0

let correctArray = []
let clues = [
    {
        text: "3 correct numbers. 2 correct positions.",
        numbers: 3,
        positions: 2,
        array: []
    },
    {
        text: "2 correct numbers. 0 correct positions.",
        numbers: 2,
        positions: 0,
        array: []
    },
    {
        text: "0 correct numbers. 0 correct positions.",
        numbers: 0,
        positions: 0,
        array: []
    }
]

const validateInputs = (e) => {
    e.target.value = ""
    if (e.keyCode >= 48 && e.keyCode <= 57) {
        return
    } else {
        e.target.value = 1
    }
}

const generateCode = (array) => {
    while (array.length < 5) {
        let num = Math.floor(Math.random() * 10)
        if (!array.includes(num)) {
            array.push(num)            
        }
    }
    return array
}

const generateClues = () => {
    let clueNum = 0

    while (clueNum < 3) {
        let clueArray = []
        clueArray = generateCode(clueArray)

        let numRight = 0
        let posRight = 0

        if (clues[0]["array"].length == 0) {
            for (let i = 0; i < clueArray.length; i++) {
                if (correctArray.includes(clueArray[i])) {
                    numRight++
                }
            }
            for (let i = 0; i < clueArray.length; i++ ) {
                if (correctArray[i] == clueArray[i]) {
                    posRight++
                }
            }
            if (numRight == 3 && posRight == 2) {
                clueNum++
                clues[0]["array"] = [...clueArray]
                continue
            }
        }
        if (clues[1]["array"].length == 0) {
            numRight = 0
            posRight = 0
            for (let i = 0; i < clueArray.length; i++) {
                if (correctArray.includes(clueArray[i])) {
                    numRight++
                }
            }
            for (let i = 0; i < clueArray.length; i++ ) {
                if (correctArray[i] == clueArray[i]) {
                    posRight++
                }
            }
            if (numRight == 2 && posRight == 0) {
                clueNum++
                clues[1]["array"] = [...clueArray]
                continue
            }
        }
        if (clues[2]["array"].length == 0) {
            numRight = 0
            posRight = 0
            for (let i = 0; i < clueArray.length; i++) {
                if (correctArray.includes(clueArray[i])) {
                    numRight++
                }
            }
            for (let i = 0; i < clueArray.length; i++ ) {
                if (correctArray[i] == clueArray[i]) {
                    posRight++
                }
            }
            if (numRight == 0 && posRight == 0) {
                clueNum++
                clues[2]["array"] = [...clueArray]
                continue
            }
        }
    }
}

const addRow = (newDetails) => {
	const newRow = document.createElement("tr")
	const newNumbers = document.createElement("td")
	newNumbers.innerHTML = newDetails["numbers"]
	newRow.appendChild(newNumbers)
	const newPositions = document.createElement("td")
	newPositions.innerHTML = newDetails["positions"]
	newRow.appendChild(newPositions)
	for (let num of newDetails["array"]) {
		const newNum = document.createElement("td")
		newNum.innerHTML = num
		newRow.appendChild(newNum)
	}
	document.getElementById("code-table").appendChild(newRow)
}

const checkGuess = () => {
    let guesses = []
    for (let input of guessInputs) {
        guesses.push(parseInt(input.value))
    }
    let numRight = 0
    let posRight = 0
    const removeDuplicates = [...new Set(guesses)]
    for (let i = 0; i < removeDuplicates.length; i++) {
        if (correctArray.includes(removeDuplicates[i])) {
            numRight++
        }
    }
    for (let i = 0; i < guesses.length; i++ ) {
        if (correctArray[i] == guesses[i]) {
            posRight++
        }
    }
    if (numRight == 5 && posRight == 5) {
        endGame("win")
    } else {
        lives--
        wrong++
        document.getElementById("guesses").innerHTML = lives
        document.getElementById("wrong").innerHTML = wrong
        let guessDetails = {
            numbers: numRight,
            positions: posRight,
            array: [...guesses]
        }
        addRow(guessDetails)
    }
    console.log(numRight, posRight)
    if (lives == 0) {
        endGame("loss")
    }
}

const endGame = (result) => {
    document.getElementById("game-over").style.display = "block"
    document.getElementById("end-result").innerHTML = result
    document.getElementById("right-code").innerHTML = correctArray.join(" ")
}

const startGame = () => {
    generateCode(correctArray)
    generateClues()

    for (let clue of clues) {
        addRow(clue)
    }

    for (let input of guessInputs) {
        input.addEventListener("keydown", validateInputs)
    }

    guessBtn.addEventListener("click", checkGuess)
}

startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})