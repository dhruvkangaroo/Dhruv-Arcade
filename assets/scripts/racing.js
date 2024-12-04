const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")
const betBtn = document.getElementById("bet")
const showMessage = document.getElementById("message")

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const horseImg = new Image()
horseImg.src = "../assets/images/racing/horses.png"
const trackImg = new Image()
trackImg.src = "../assets/images/racing/track.png"
const foregroundImg = new Image()
foregroundImg.src = "../assets/images/racing/foreground.png"
const finishImg = new Image()
finishImg.src = "../assets/images/racing/finish.png"

const gameWidth = 320
const gameHeight = 320

let horses = []
let finishOrder = []
let lastTime = 0
let gameOver = false
let finishing = false
let speed = 0
let selection = ""
let time = 0

// Class for foreground and background images? They'll be looping the same
class Track {
    constructor(image, posY, height) {
        this.img = image
        this.x = 0
        this.y = posY
        this.width = gameWidth
        this.height = height
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.img, this.x + this.width, this.y, this.width, this.height)
    }
    update() {
        this.x -= speed
        if (this.x < 0 - this.width) {
            this.x = 0
        }
    }
}

// Class for the finish line - only need it to end the game
class Line {
    constructor(image, posX) {
        this.img = image
        this.x = posX
        this.y = 128
        this.width = 8
        this.height = 128
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
    update() {
        if (this.x > 0 - this.width) {
            this.x = this.x -= speed
        }
    }
    endRace() {
        horses.forEach(horse => {
            if (this.x <= horse.x + horse.width && !finishOrder.includes(horse.name)) {
                finishOrder.push(horse.name)
            }
        })
        if (horses.length == finishOrder.length) {
            setTimeout(() => {
                speed = 0
            }, 500)
            setTimeout(() => {
                endGame()
            }, 1000);
        }
    }
}

// Class for the horses - need some element of randomness to their "speed"
class Horse {
    constructor(name, posY, frameY) {
        this.name = name
        this.img = horseImg
        this.x = 124
        this.y = posY
        this.width = 64
        this.height = 48
        this.frameX = 0
        this.frameY = frameY
        this.frameCount = 4
        this.frameTimer = 0
        this.fps = 3
        this.frameInterval = 1000/this.fps
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
    }
    update(deltaTime) {
        if (speed > 0) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.frameCount) {
                    this.frameX = 1
                } else {
                    this.frameX++
                }
                this.randomPosition()
                this.frameTimer = 0
            } else {
                this.frameTimer += deltaTime * speed
            }
        } else {
            this.frameX = 0
        }
    }
    // Move them around a bit
    randomPosition() {
        let chance = Math.floor(Math.random() * 2)
        if (chance == 1) {
            let flip = Math.random() < 0.5 ? "gain" : "lose"
            if (flip == "gain") {
                this.x++
            } else {
                this.x--
            }
        }
    }
}

// Spawn the horses in a bit of a random order
const spawnHorses = () => {
    let horseArray = [0, 48, 96, 144]
    for (let i = 0; i < 4; i++) {
        let randomHorse = horseArray.splice(Math.floor(Math.random() * horseArray.length), 1)
        let newHorse
        if (randomHorse == 0) {
            newHorse = new Horse("green", 100 + (i * 32), randomHorse)
        } else if (randomHorse == 48) {
            newHorse = new Horse("blue", 100 + (i * 32), randomHorse)
        } else if (randomHorse == 96) {
            newHorse = new Horse("purple", 100 + (i * 32), randomHorse)
        } else {
            newHorse = new Horse("red", 100 + (i * 32), randomHorse)
        }
        horses.push(newHorse)
    }
}

// Draw and update horses
const handleHorses = (ctx, deltaTime) => {
    horses.forEach(horse => {
        horse.draw(ctx)
        if (speed > 0) {
            horse.update(deltaTime)
        }
    })
}

// Show the popup for picking a horse
const showHorse = () => {
    document.getElementById("horse-selection").style.display = "block"
    document.getElementById("selected").addEventListener("click", selectHorse)
}

// Handle the user's selection - Series of timeouts?? Lazy, probably a better way
const selectHorse = () => {
    document.getElementById("horse-selection").style.display = "none"
    selection = document.querySelector("input[name='color']:checked").value
    displayMessage(`You chose the ${selection} horse!`)
    setTimeout(() => {
        displayMessage("Get ready...")
    }, 1000)
    setTimeout(() => {
        displayMessage("Go!", true)
    }, 2000)
    setTimeout(() => {
        speed = 2
        runGame(0)
        timer()
    }, 2500)
}

// Timer to count up to finishing
const timer = () => {
    let startTime = setInterval(() => {
        time++
        if (time >= 30) {
            finishing = true
            clearInterval(startTime)
        }
    }, 1000)
}

// Display messages
const displayMessage = (message, timeout) => {
    showMessage.style.display = "block"
    showMessage.innerHTML = message
    if (timeout) {
        setTimeout(() => {
            showMessage.style.display = "none"
        }, 1000)
    }
}

const startGame = () => {
    startBtn.removeEventListener("click", startGame)
    spawnHorses()
    background.draw(ctx)
    startLine.draw(ctx)
    handleHorses(ctx)
    foreground.draw(ctx)
    displayMessage("The race is about to start! Choose a horse to back!")
    betBtn.style.display = "inline-block"
    betBtn.addEventListener("click", showHorse)
}

const endGame = () => {
    document.getElementById("game-over").style.display = "block"
    document.getElementById("user-choice").innerHTML = selection
    let finishingOrder = finishOrder.join(", ")
    document.getElementById("order").innerHTML = finishingOrder
    if (finishOrder[0] == selection) {
        document.getElementById("result").innerHTML = "Your horse won!"
    } else {
        document.getElementById("result").innerHTML = "Better luck next time..."
    }
}

const background = new Track(trackImg, 0, 320)
const foreground = new Track(foregroundImg, 224, 96)
const startLine = new Line(finishImg, 192)
const finishLine = new Line(finishImg, 320)

const runGame = (timeStamp) => {
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    ctx.clearRect(0, 0, gameWidth, gameHeight)
    background.draw(ctx)
    background.update()
    startLine.draw(ctx)
    startLine.update()
    if (finishing) {
        finishLine.draw(ctx)
        finishLine.update()
        finishLine.endRace()
    }
    handleHorses(ctx, deltaTime)
    foreground.draw(ctx)
    foreground.update()
    if (!gameOver) {
        requestAnimationFrame(runGame)
    }
}

betBtn.style.display = "none"
startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})
