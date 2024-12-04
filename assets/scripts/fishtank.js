window.addEventListener("load", () => {
    const startBtn = document.getElementById("start")
    const resetBtn = document.getElementById("reset")
    const creditDisplay = document.getElementById("credits")
    const tankBtn = document.getElementById("tanks")
    const fishBtn = document.getElementById("fish")
    const miscBtn = document.getElementById("misc")
    const cancelBtns = document.getElementsByClassName("cancel")

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    const bgImg = new Image()
    bgImg.src = "../assets/images/fishtank/background.png"
    const fishImg = new Image()
    fishImg.src = "../assets/images/fishtank/fish.png"
    const snailImg = new Image()
    snailImg.src = "../assets/images/fishtank/snail.png"
    const smallTankImg = new Image()
    smallTankImg.src = "../assets/images/fishtank/smalltank.png"
    const mediumTankImg = new Image()
    mediumTankImg.src = "../assets/images/fishtank/mediumtank.png"
    const largeTankImg = new Image()
    largeTankImg.src = "../assets/images/fishtank/largetank.png"
    const foodImg = new Image()
    foodImg.src = "../assets/images/fishtank/food.png"
    const spongeImg = new Image()
    spongeImg.src = "../assets/images/fishtank/sponge.png"

    const gameWidth = 320
    const gameHeight = 288
    const tileSize = 32
    let fishArray = []
    let snailArray = []
    let miscArray = []
    let tank = {}
    let lastTime = 0
    let credits = 100
    let tankHealth = "good"
    let gameOver = false
    let paused = false
    
    class Background {
        constructor() {
            this.img = bgImg
            this.x = 0
            this.y = 0
            this.width = gameWidth
            this.height = gameHeight
        }
        draw(context) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
    }

    class Tank {
        constructor(tankImg, tankX, tankY, tankW, tankH) {
            this.img = tankImg
            this.x = tankX
            this.y = tankY
            this.frameX = 0
            this.frameY = 0
            this.width = tankW
            this.height = tankH
            this.health = 100
            this.healthCounter = 0
            this.healthThreshold = 5000
            this.snailClean = false
        }
        draw(context) {
            context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(deltaTime) {
            if (this.healthCounter > this.healthThreshold) {
                this.health -= 1 + fishArray.length
                this.healthCounter = 0
                if (snailArray.length > 0) {
                    if (this.snailClean) {
                        this.health += snailArray.length
                        this.snailClean = false
                    } else {
                        this.snailClean = true
                    }                    
                }
            } else {
                this.healthCounter += deltaTime
            }
            if (this.health < 40) {
                tankHealth = "poor"
                this.frameY = this.height * 2
            } else if (this.health < 70) {
                tankHealth = "fair"
                this.frameY = this.height
            } else if (this.health >= 70) {
                tankHealth = "good"
                this.frameY = 0
            } else {
                gameOver = true
            }
        }
    }

    const addTank = (size) => {
        switch (size) {
            case "small":
                tank = new Tank(smallTankImg, 112, 144, 96, 80);
                break;
            case "medium":
                tank = new Tank(mediumTankImg, 80, 128, 160, 96);
                break;
            case "large":
                tank = new Tank(largeTankImg, 32, 112, 256, 112);
                break;
        }
    }

    class Fish {
        constructor(startX, startY, fishY, startMoveX, startMoveY) {
            this.img = fishImg
            this.x = startX
            this.y = startY
            this.width = tileSize
            this.height = tileSize
            this.frameX = 0
            this.frameY = fishY
            this.flipTimer = 0
            this.flipInterval = Math.random() * 4000 + 4000
            this.moveSpeed = Math.floor(Math.random() * 5 + 1) / 10
            this.moveX = startMoveX
            this.moveY = startMoveY
            this.health = 100
            this.healthCounter = 0
            this.healthThreshold = 5000
            this.hungerCounter = 0
            this.hungerThreshold = 20000
            this.hungry = false
            this.dead = false
        }
        draw(context) {
            context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(deltaTime) {
            this.x += this.moveX
            this.y += this.moveY
            if (this.hungerCounter > this.hungerCounter) {
                this.hungry = true
            } else {
                this.hungerCounter += deltaTime
            }
            if (this.health > 0) {
                if (this.healthCounter > this.healthThreshold) {
                    if (tankHealth == "poor") {
                        this.health -= 5
                    } else if (tankHealth == "fair") {
                        this.health--
                    } else if (tankHealth == "good" && this.health < 10 && !this.hungry) {
                        this.health++
                    }
                    if (this.hungry) {
                        this.health--
                    }
                    this.healthCounter = 0
                } else {
                    this.healthCounter += deltaTime
                }                
            } else {
                this.dead = true
            }
            if (this.dead) {
                this.moveX = 0
                if (this.y + this.height < tank.y + tank.height + 4) {
                    this.moveY = 0.05
                } else {
                    this.moveY = 0
                }
            } else {
                if (this.flipTimer > this.frameInterval) {
                    this.frameX = this.frameX == 0 ? 1 : 0
                    this.moveX = this.moveSpeed > 0 ? -this.moveSpeed : this.moveSpeed
                    this.flipInterval = Math.random() * 4000 + 4000
                } else if (this.x <= tank.x + 4) {
                    this.moveSpeed = this.calculateSpeed()
                    this.moveX = this.moveSpeed
                    this.frameX = 0
                } else if (this.x + this.width + 4 >= tank.x + tank.width) {
                    this.moveSpeed = this.calculateSpeed()
                    this.moveX = -this.moveSpeed
                    this.frameX = 1
                } else {
                    this.flipTimer += deltaTime
                }
                if (this.y <= tank.y + 4) {
                    this.moveSpeed = this.calculateSpeed()
                    this.moveY = this.moveSpeed
                } else if (this.y + this.height >= tank.y + tank.height) {
                    this.moveSpeed = this.calculateSpeed()
                    this.moveY = -this.moveSpeed
                }            
            }
        }
        calculateSpeed() {
            if (this.health < 50 || this.hungry) {
                return Math.floor(Math.random() * 5 + 1) / 100
            } else {
                return Math.floor(Math.random() * 5 + 1) / 10
            }
        }
    }

    const addFish = (fish) => {
        let frameY = fish
        let randomStartX = Math.floor(Math.random() * (160 - 128 + 1)) + 128
        let randomStartY = Math.floor(Math.random() * (192 - 160 + 1)) + 160
        let startMoveX = Math.floor(Math.random() * 5 + 1) / 10
        let startMoveY = Math.floor(Math.random() * 5 + 1) / 10
        let newFish = new Fish(randomStartX, randomStartY, frameY, startMoveX, startMoveY)
        fishArray.push(newFish)
    }

    const handleFish = (deltaTime) => {
        fishArray.forEach(fish => {
            fish.draw(ctx)
            fish.update(deltaTime)
        })
    }

    class Misc {
        constructor(itemImage, itemName, itemX, itemY, itemWidth, itemHeight) {
            this.img = itemImage
            this.name = itemName
            this.x = itemX
            this.y = itemY
            this.width = itemWidth
            this.height = itemHeight
        }
        draw(context) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
        action(clickX, clickY) {
            if (clickX >= this.x &&
                clickX <= this.x + this.width &&
                clickY >= this.y &&
                clickY <= this.y + this.height) {
                    if (this.name == "food") {
                        fishArray.forEach(fish => {
                            fish.hungry = false
                            fish.hungerCounter = 0
                        })
                    }

                    if (this.name == "sponge") {
                        tank.health = 100
                    }
                }
        }
    }

    const addMisc = (miscItem) => {
        if (miscItem == "food") {
            let foodItem = new Misc(foodImg, "food", 96, 0, 32, 64)
            miscArray.push(foodItem)
        } else if (miscItem == "sponge") {
            let spongeItem = new Misc(spongeImg, "sponge", 160, 32, 32, 32)
            miscArray.push(spongeItem)
        }
    }

    const handleMisc = (ctx) => {
        miscArray.forEach(misc => misc.draw(ctx))
    }

    class Snail {
        constructor() {
            this.img = snailImg
            this.frameX = 1
            this.x = 160
            this.y = 204
            this.size = 16
            this.moveX = 0.01
            this.moveY = 0
            this.moveSpeed = 0.01
            this.horizontal = true
        }
        draw(context) {
            context.drawImage(this.img, this.frameX * this.size, 0, this.size, this.size, this.x, this.y, this.size, this.size)
        }
        update() {
            this.x += this.moveX
            this.y += this.moveY
            if (this.horizontal) {
                if (this.x <= tank.x) {
                    if (Math.floor(Math.random() * 2) == 0) {
                        this.moveX = 0
                        this.moveY = -this.moveSpeed
                        this.frameX = 2
                        this.horizontal = false
                    } else {
                        this.moveX = -this.moveSpeed
                        this.moveY = 0
                        this.frameX = 1
                        this.horizontal = true
                    }
                } else if (this.x + this.size >= tank.x + tank.width) {
                    if (Math.floor(Math.random() * 2) == 0) {
                        this.moveX = 0
                        this.moveY = -this.moveSpeed
                        this.frameX = 3
                        this.horizontal = false
                    } else {
                        this.moveX = -this.moveSpeed
                        this.moveY = 0
                        this.frameX = 0
                        this.horizontal = true
                    }
                }
            } else if (!this.horizontal) {
                if (this.y <= tank.y) {
                    this.moveX = 0
                    this.moveY = this.moveSpeed
                    this.horizontal = false
                    if (this.x <= tank.x) {
                        this.frameX = 4
                    } else if (this.x + this.size >= tank.x + tank.width) {
                        this.frameX = 5
                    }
                } else if (this.y + this.size >= tank.y + tank.height) {
                    this.horizontal = true
                }
            }
        }
    }

    const handleSnails = (ctx) => {
        snailArray.forEach(snail => {
            snail.draw(ctx)
            snail.update()
        })
    }

    const updateGame = () => {
        let time = 0
        let startTime = setInterval(() => {
            time++
            if (!paused) {
                credits++
                if (tankHealth == "good") {
                    fishArray.forEach(fish => {
                        if (fish.health > 8) credits++
                    })                
                }                
            }
            creditDisplay.innerHTML = credits
            if (gameOver) {
                clearInterval(startTime)
            }
        }, 1000)
    }

    const startGame = () => {
        addTank("small")
        addFish(32)
        updateGame()
        runGame(0)
        document.getElementById("options").style.display = "block"
    }

    const displayMessage = (message) => {
        let showMessage = document.getElementById("message")
        showMessage.style.display = "block"
        showMessage.innerHTML = message
        setTimeout(() => {
            showMessage.style.display = "none"
        }, 1500);
    }

    // This can all probably be refactored...
    const showTanks = () => {
        removeListeners()
        paused = true
        document.getElementById("show-tanks").style.display = "flex"
        if (tank.x == 112) {
            document.getElementById("small").disabled = true
        } else if (tank.x == 48) {
            document.getElementById("medium").disabled = true
        } else if (tank.x == 32) {
            document.getElementById("large").disabled = true
        }
        document.getElementById("select-tank").addEventListener("click", chooseTank)
    }
    
    const chooseTank = () => {
        document.getElementById("small").disabled = false
        document.getElementById("medium").disabled = false
        document.getElementById("large").disabled = false
        let selection = document.querySelector("input[name='tank']:checked").value
        let [chosenTank, price] = selection.split("-")
        if (price < credits) {
            credits -= price
            addTank(chosenTank)
        } else {
            displayMessage("You can't afford this tank!")
        }
        addListeners()
        paused = false
        let tanks = document.getElementsByName("tanks")
        for (let tank of tanks) tank.checked = false
        document.getElementById("show-tanks").style.display = "none"
        document.getElementById("select-tank").removeEventListener("click", chooseTank)
    }

    const showFish = () => {
        paused = true
        removeListeners()
        document.getElementById("show-fish").style.display = "flex"
        document.getElementById("select-fish").addEventListener("click", chooseFish)
    }

    const chooseFish = () => {
        let selection = document.querySelector("input[name='fishes']:checked").value
        let [chosenFish, price] = selection.split("-")
        if (price < credits) {
            credits -= price
            addFish(chosenFish)
        } else {
            displayMessage("You can't afford this fish!")
        }
        addListeners()
        paused = false
        let fishes = document.getElementsByName("fishes")
        for (let fish of fishes) fish.checked = false
        document.getElementById("show-fish").style.display = "none"
        document.getElementById("select-fish").removeEventListener("click", chooseFish)
    }

    const showMisc = () => {
        removeListeners()
        paused = true
        for (let miscItem of miscArray) {
            if (miscItem.name == "food") {
                document.getElementById("food").disabled = true
            } else if (miscItem.name == "sponge") {
                document.getElementById("sponge").disabled = true
            }
        }
        document.getElementById("show-misc").style.display = "flex"
        document.getElementById("select-misc").addEventListener("click", chooseMisc)
    }

    const chooseMisc = () => {
        let selection = document.querySelector("input[name='misc']:checked").value
        let [chosenMisc, price] = selection.split("-")
        if (price < credits) {
            credits -= price
            if (chosenMisc == "snail" && snailArray.length < 4) {
                let snail = new Snail()
                snailArray.push(snail)
            } else {
                addMisc(chosenMisc)
            }
        } else {
            displayMessage(`You can't afford this ${chosenMisc}.`)
        }
        addListeners()
        paused = false
        let miscs = document.getElementsByName("misc")
        for (let misc of miscs) misc.checked = false
        document.getElementById("show-misc").style.display = "none"
        document.getElementById("select-misc").removeEventListener("click", chooseMisc)
    }

    const addListeners = () => {
        tankBtn.addEventListener("click", showTanks)
        fishBtn.addEventListener("click", showFish)
        miscBtn.addEventListener("click", showMisc)
    }

    const removeListeners = () => {
        tankBtn.removeEventListener("click", showTanks)
        fishBtn.removeEventListener("click", showFish)
        miscBtn.removeEventListener("click", showMisc)
    }

    // Clicking on misc items
    canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        miscArray.forEach(item => {
            item.action(x, y)
        })
    })

    addListeners()
    for (let cancelBtn of cancelBtns) {
        cancelBtn.addEventListener("click", () => {
            addListeners()
            paused = false
            cancelBtn.parentNode.parentNode.style.display = "none"
        })
    }

    const background = new Background()

    const runGame = (timeStamp) => {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        if (!paused) {
            handleFish(deltaTime)
            if (snailArray.length > 0) {
                handleSnails(ctx)
            }
            tank.draw(ctx)
            tank.update(deltaTime)
            if (miscArray.length > 0) {
                handleMisc(ctx)
            }            
        }
        requestAnimationFrame(runGame)
    }

    startBtn.addEventListener("click", startGame)
    resetBtn.addEventListener("click", () => {
        location.reload()
    })
})