const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")
const catSelect = document.getElementById("categories")
const diffSelect = document.getElementById("difficulty")
const numDisplay = document.getElementById("count-question")
const queNum = document.getElementById("question-number")
const queDisplay = document.getElementById("question")
const ansDisplay = document.getElementById("answers")

let queArray = []
let correctAns = ""
let score = 0
let round = 0

async function getQuestionArray(category, difficulty) {
  let response = await fetch(`https://the-trivia-api.com/api/questions?categories=${category}&limit=10&region=IE&difficulty=${difficulty}`)
  let data = await response.json();
  queArray = data
  displayQuestion()
}

function startGame() {
    startBtn.removeEventListener("click", startGame)

    let selectedCat = catSelect.value
    let selectedDiff = diffSelect.value
    getQuestionArray(selectedCat, selectedDiff)
}

function displayQuestion() {
    ansDisplay.innerHTML = ""
    round += 1
    numDisplay.style.display = "block"
    queNum.innerHTML = round

    // Get a random question from our array
    const randQue = queArray.splice(Math.floor(Math.random() * queArray.length), 1)[0]
    // Display that question
    queDisplay.innerHTML = randQue.question
    // Save the correct answer
    correctAns = randQue.correctAnswer
    // Consolidate the answers
    let ansArray = randQue.incorrectAnswers
    ansArray = [...ansArray, correctAns]
    while (ansArray.length > 0) {
        let randAns = ansArray.splice(Math.floor(Math.random() * ansArray.length), 1)
        let ansP = document.createElement("button")
        ansP.innerHTML = randAns
        ansP.addEventListener("click", checkAnswer)
        ansDisplay.append(ansP)
    }
}

function checkAnswer(e) {
    console.log(e.target.innerHTML)
    console.log(correctAns)
    console.log(e.target)
    if (e.target.innerHTML == correctAns) {
        score += 1
        e.target.classList.add("right")
        setTimeout(() => {
            ansDisplay.innerHTML = `Correct! The answer was ${correctAns}`            
        }, 1000)
    } else {
        e.target.classList.add("wrong")
        setTimeout(() => {
            ansDisplay.innerHTML = `Wrong... The answer was ${correctAns}`            
        }, 1000)
    }
    setTimeout(() => {
        checkEnd()
    }, 2000)
}

function checkEnd() {
    if (queArray.length == 0) {
        document.getElementById("game-over").style.display = "block"
        document.getElementById("result").innerHTML = score
    } else {
        displayQuestion()
    }
}

startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})