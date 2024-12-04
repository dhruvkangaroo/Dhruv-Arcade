/* DOM elements */
const textDisplay = document.getElementById("test-text")
const userInput = document.getElementById("user-input")
const timeDisplay = document.getElementById("time-left")
const wpmDisplay = document.getElementById("wpm")
const cpmDisplay = document.getElementById("cpm")
const errorDisplay = document.getElementById("errors")
const overallDisplay = document.getElementById("overall")
const cpmResult = document.getElementById("cpm-result")
const wpmResult = document.getElementById("wpm-result")
const accResult = document.getElementById("accuracy")
const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")

/* Variables */
let testText
let charIndex = 0
let chars = 0
let words = 0
let errors = 0
let accuracy = 0
let timer
let time = 60

/**
 * Retrieves a page of text from the Lit Ipsum api
 * Calls display(Text)
 */
async function getText() {
    let response = await fetch(`https://litipsum.com/api/p/json`)
    let data = await response.json()
    testText = data.text
    displayText()
}

/**
 * Need to append individual characters to our textDisplay rather that
 * whole paragraphs
 * Also have to replace curly quotes in the text with regular quotes to
 * avoid unnecessary errors
 */
function displayText() {
    Object.values(testText).forEach(paragraph => {
        paragraph = paragraph.replace(/<p>/g, '').replace(/<\/p>/g, ' ').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
        paragraph.split("").forEach(char => {
            const span = document.createElement("span")
            span.innerText = char
            textDisplay.appendChild(span)
        })
    })
}

/**
 * Update the WPM, CPM, Error and Time displays
 */
function updateStats() {
    chars = charIndex - errors
    words = Math.round((((charIndex - errors) / 5) / (60 - time)) * 60)
    words = words < 0 || !words || words === Infinity ? 0 : words
    timeDisplay.innerHTML = time
    wpmDisplay.innerHTML = words
    cpmDisplay.innerHTML = chars
    errorDisplay.innerHTML = errors
}

// Simple countdown function
function countdown() {
    if (time <= 0) {
        clearInterval(timer)
    } else {
        time -= 1
    }
    updateStats()
}

/**
 * Checking our user input versus the characters in our spans
 * Assigns right/wrong classes and updates errors updates
 */
function userTyping() {
    const testChars = textDisplay.querySelectorAll("span")
    let userChar = userInput.value.split("")[charIndex]
    
    if (time > 0) {
        if (userChar == null) {
            charIndex--
            if (testChars[charIndex].classList.contains("wrong")) {
                errors--
            }
            testChars[charIndex].classList.remove("right", "wrong")
        } else {
            if (testChars[charIndex].innerText === userChar) {
                testChars[charIndex].classList.add("right")
            } else {
                errors += 1
                testChars[charIndex].classList.add("wrong")
            }
            charIndex++        
        }
    } else {
        clearInterval(timer)
        endGame()
    }
    testChars.forEach(char => char.classList.remove("current"))
    testChars[charIndex].classList.add("current")
}

/**
 * Scrolls the textDisplay window as the user is typing based on the
 * position of the cursor
 */
userInput.addEventListener("keyup", scroll)
function scroll(event) {
    if (event.target.selectionStart % 50 == 0) {
        textDisplay.scroll({top: (event.target.selectionStart / 2), behavior: "smooth"})
    }
}

/**
 * Start function to call our getText, add our event listeners
 * and start the countdown
 */
function startTest() {
    getText()
    textDisplay.addEventListener("click", () => userInput.focus())
    document.addEventListener("keydown", () => userInput.focus())
    userInput.addEventListener("input", userTyping)   
    timer = setInterval(countdown, 1000)
}

/**
 * Display our end results
 */
function endGame() {
    document.getElementById("game-over").style.display = "block"
    cpmResult.innerHTML = chars
    wpmResult.innerHTML = words
    if (errors === 0) {
        accuracy = 100
    } else {
        let num = chars - errors
        accuracy = Math.round((num / chars) * 100).toFixed(2)
    }
    accResult.innerHTML = accuracy
}

startBtn.addEventListener("click", startTest)
reset.addEventListener("click", () => {
    location.reload() 
  })