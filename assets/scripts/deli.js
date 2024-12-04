window.addEventListener("load", () => {
    const startBtn = document.getElementById("start")
    const resetBtn = document.getElementById("reset")

    const timeDisplay = document.getElementById("timer")
    const scoreDisplay = document.getElementById("score")

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")


    // Images
    const backgroundImg = new Image()
    backgroundImg.src = "../assets/images/deli/counter.png"
    const tinImg = new Image()
    tinImg.src = "../assets/images/deli/tins.png"
    const brownImg = new Image()
    brownImg.src = "../assets/images/deli/brownsauce.png"
    const mayoImg = new Image()
    mayoImg.src = "../assets/images/deli/mayo.png"
    const butterImg = new Image()
    butterImg.src = "../assets/images/deli/butter.png"
    const rollsImg = new Image()
    rollsImg.src = "../assets/images/deli/rollpile.png"
    const cutrollImg = new Image()
    cutrollImg.src = "../assets/images/deli/rollcut.png"
    const ingredientsImg = new Image()
    ingredientsImg.src = "../assets/images/deli/ingredients.png"
    const ticketImg = new Image()
    ticketImg.src = "../assets/images/deli/ticket.png"
    const bellImg = new Image()
    bellImg.src = "../assets/images/deli/bell.png"


    // Variables
    const gameWidth = 320
    const gameHeight = 288
    const tileSize = 48

    let ingredientArray = []
    
    let ticketNumber = 0
    let ticketTimer = 0
    let ticketInterval = 2000
    let randomTicketInterval = Math.random() * 1000 + 1000
    let ticketArray = []

    let currentSandwich = {}

    let score = 0
    let lastTime = 0
    let gameOver = false

    // Background
    class Background {
        constructor() {
            this.img = backgroundImg
            this.x = 0
            this.y = 0
            this.width = gameWidth
            this.height = gameHeight
        }
        draw(context) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
    }

    // Ingredients
    class Ingredient {
        constructor(ingredientImg, positionX, positionY, imgWidth, imgX, name) {
            this.img = ingredientImg
            this.x = positionX
            this.y = positionY
            this.width = imgWidth
            this.height = tileSize
            this.frameX = imgX
            this.frameY = 0
            this.name = name
        }
        draw(context) {
            context.drawImage(this.img, this.frameX, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        addIngredient(clickX, clickY) {
            // if clicked push this ingredients name to the currentSandwich ingredientArray
            const distanceX = (this.x + this.width/2) - clickX
            const distanceY = (this.y + this.height/2) - clickY
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
            if (distance < this.height / 2) {
                console.log(this.name + " was clicked")
                if (this.name == "roll" && Object.keys(currentSandwich).length === 0) {
                    currentSandwich = new Sandwich()
                    currentSandwich.ingredientArray.push(this.name)
                }
                if (this.name != "roll" && Object.keys(currentSandwich).length != 0) {
                    currentSandwich.ingredientArray.push(this.name)
                }
            }
        }
    }
    
    const spawnIngredients = () => {
        let startXPosition = [16, 64, 112, 160, 208, 256]
        let tinArray = ["chicken", "cheese", "lettuce", "onion", "pepper", "tomato"]
        for (let i = startXPosition.length - 1; i >= 0; i--) {
            let posX = startXPosition.splice(Math.floor(Math.random() * startXPosition.length), 1)
            let name = tinArray[i]
            let image = tinImg
            let imgX = 0 + (i * 48)
            console.log(name)
            console.log("which image: ", imgX)
            console.log("position: ", posX)
            ingredientArray.push(new Ingredient(image, posX[0], 96, 48, imgX, name))
        }
        ingredientArray.push(new Ingredient(brownImg, 16, 144, 48, 0, "ketchup"))
        ingredientArray.push(new Ingredient(mayoImg, 64, 144, 48, 0, "mayo"))
        ingredientArray.push(new Ingredient(butterImg, 16, 192, 48, 0, "butter"))
        ingredientArray.push(new Ingredient(rollsImg, 208, 144, 96, 0, "roll"))
    }
    
    const handleIngredients = () => {
        ingredientArray.forEach(ingredient => {
            ingredient.draw(ctx)
        })
    }

    // Bell
    class Bell {
        constructor() {
            this.img = bellImg
            this.x = 208
            this.y = 192
            this.width = tileSize
            this.height = tileSize
        }
        draw(context) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
        ringBell(clickX, clickY) {
            const distanceX = (this.x + this.width/2) - clickX
            const distanceY = (this.y + this.height/2) - clickY
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
            if (distance < this.height / 2) {
                let ticket = ticketArray[0].fillings
                let sandwich = currentSandwich.ingredientArray
                sandwich.shift()
                console.log(ticket)
                console.log(sandwich)
                if (sandwich.length == ticket.length) {
                    console.log("same length")
                    if (compareArrays(ticket, sandwich)) {
                        console.log("identical")
                        score += 10
                    } else {
                        ticket.sort()
                        sandwich.sort()
                        if (compareArrays(ticket, sandwich)) {
                            console.log("out of order")
                            score += 8
                        } else {
                            console.log("different ingredients")
                            score += 2
                            for (let i = 0; i < ticket.length; i++) {
                                if (ticket[i] === sandwich[i]) {
                                    score++
                                }
                            }
                        }
                    }
                } else {
                    ticket.sort()
                    sandwich.sort()
                    for (let i = 0; i < ticket.length; i++) {
                        if (ticket[i] === sandwich[i]) {
                            score++
                        }
                    }
                }
                ticketNumber++
                currentSandwich = {}
                ticketArray.shift()
        }
        }
    }

    const compareArrays = (a, b) => {
        for (let i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false
            }
        }
        return true
    }


    // Tickets - create a ticket 
    class Ticket {
        constructor(selectedFillings) {
            this.img = ticketImg
            this.x = 16
            this.y = 22
            this.width = tileSize
            this.height = 64
            this.fillings = selectedFillings
        }
        draw(context) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
            context.font = "10px Arial"
            for (let i = 0; i < this.fillings.length; i++) {
	            context.fillText(this.fillings[i], this.x + 6, this.y + (10 + (i * 10)))
            }
        }
    }

    const handleTickets = (ctx, deltaTime) => {
        let fillings = ["ketchup", "mayo", "butter", "chicken", "cheese", "lettuce", "onion", "pepper", "tomato"]
        if (ticketArray.length < 6) {
            if (ticketTimer > ticketInterval + randomTicketInterval) {
                let randomNumFillings = Math.floor(Math.random() * (5 - 3 + 1) + 3)
                let selectedFillings = []
                for (let i = 0; i < randomNumFillings; i++) {
                    let randomFilling = fillings[Math.floor(Math.random() * fillings.length)]
                    selectedFillings.push(randomFilling)
                }
                ticketArray.push(new Ticket(selectedFillings))
                randomTicketInterval = Math.random() * 4000 + 1000
                ticketTimer = 0
            } else {
                ticketTimer += deltaTime
            }
        }

        ticketArray.forEach((ticket, index) => {
            ticket.x = 16 + (index * 48)
            ticket.draw(ctx)
        })
    }

    // The sandwich
    class Sandwich {
        constructor() {
            this.img = ingredientsImg
            this.rollImg = cutrollImg
            this.ingredientArray = []
            this.x = 112
            this.y = 176
            this.width = 96
            this.height = 32
        }
        draw(context) {
            if (this.ingredientArray.includes("roll")) {
                context.drawImage(this.rollImg, this.x, this.y, this.width, this.height)
            }
            for (let i = 0; i < this.ingredientArray.length; i++) {
                if (this.ingredientArray[i] == "ketchup") {
                    context.drawImage(this.img, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height)
                } else if (this.ingredientArray[i] == "butter") {
                    context.drawImage(this.img, 0, 32, this.width, this.height, this.x, this.y, this.width, this.height)
                } else if (this.ingredientArray[i] == "mayo") {
                    context.drawImage(this.img, 0, 64, this.width, this.height, this.x, this.y, this.width, this.height)
                } else if (this.ingredientArray[i] == "cheese") {
                    context.drawImage(this.img, 0, 96, this.width, this.height, this.x, this.y, this.width, this.height)
                } else if (this.ingredientArray[i] == "chicken") {
                    context.drawImage(this.img, 0, 128, this.width, this.height, this.x, this.y, this.width, this.height)
                } else if (this.ingredientArray[i] == "lettuce") {
                    context.drawImage(this.img, 0, 160, this.width, this.height, this.x, this.y, this.width, this.height)
                } else if (this.ingredientArray[i] == "onion") {
                    context.drawImage(this.img, 0, 192, this.width, this.height, this.x, this.y, this.width, this.height)
                } else if (this.ingredientArray[i] == "pepper") {
                    context.drawImage(this.img, 0, 224, this.width, this.height, this.x, this.y, this.width, this.height)
                } else if (this.ingredientArray[i] == "tomato") {
                    context.drawImage(this.img, 0, 256, this.width, this.height, this.x, this.y, this.width, this.height)
                }
            }
        }
    }

    const handleSandwiches = (ctx) => {
        if (Object.keys(currentSandwich).length != 0) {
            currentSandwich.draw(ctx)
        }
    }

    const handleDisplay = () => {
        let time = 180
        let startTime = setInterval(() => {
            time--
            timeDisplay.innerHTML = time
            scoreDisplay.innerHTML = score
            if (time <= 0) {
                gameOver = true
                clearInterval(startTime)
                timeDisplay.innerHTML = "GAME OVER!"
                document.querySelector("#sandwiches").innerHTML = ticketNumber
                document.querySelector("#result").innerHTML = score
                document.querySelector("#game-over").style.display = "block"
                startBtn.addEventListener("click", startGame)
            }
        }, 1000)
    }

    canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        console.log(x, y)

        ingredientArray.forEach(ingredient => {
            ingredient.addIngredient(x, y)
        })
        bell.ringBell(x, y)
    })


    const background = new Background()
    const bell = new Bell()

    const animate = (timeStamp) => {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        bell.draw(ctx)
        handleIngredients()
        handleSandwiches(ctx)
        handleTickets(ctx, deltaTime)

        if (!gameOver) {
            requestAnimationFrame(animate)
        }
    }
    
    const startGame = () => {
        spawnIngredients()
        handleDisplay()
        startBtn.removeEventListener("click", startGame)
        animate(0)
    }

    startBtn.addEventListener("click", startGame)
    resetBtn.addEventListener("click", () => {
        location.reload()
    })
})