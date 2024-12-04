window.addEventListener("load", () => {
    const startBtn = document.getElementById("start")
    const resetBtn = document.getElementById("reset")
    const selectCar = document.getElementById("select-car")
    const carDisplay = document.getElementById("car-choice")
    const timeDisplay = document.getElementById("timer")
    const scoreDisplay = document.getElementById("score")

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    const bgImg = new Image()
    bgImg.src = "../assets/images/vroom/road.png"
    const carsImg = new Image()
    carsImg.src = "../assets/images/vroom/cars.png"
    const carsDownImg = new Image()
    carsDownImg.src = "../assets/images/vroom/carsdown.png"

    const gameWidth = 320
    const gameHeight = 288
    const tileSize = 32
    let time = 0
    let score = 0
    let carUpArray = []
    let carDownArray = []
    let carUpTimer = 0
    let carDownTimer = 0
    let carUpInterval = 5000
    let carDownInterval = 5000
    let carUpRandomInterval = Math.random() * 1000 + 3000
    let carDownRandomInterval = Math.random() * 1000 + 3000
    let lastTime = 0
    let gameOver = false
    let velocity = 0.5
    let player = {}

    class Background {
        constructor() {
            this.img = bgImg
            this.x = 0
            this.y = 0
            this.width = gameWidth
            this.height = gameHeight
            this.speed = 0.5
        }
        draw(context) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
            context.drawImage(this.img, this.x, this.y - this.height + 1, this.width, this.height)
            context.drawImage(this.img, this.x, this.y + this.height - 1, this.width, this.height)
        }
        update() {
            this.speed = velocity
            this.y += this.speed
            if (this.y >= this.height) {
                this.y = 0
            } else if (this.y < -this.height) {
                this.y = 0
            }
        }
    }

    class Player {
        constructor(imgX, imgY) {
            this.img = carsImg
            this.width = tileSize * 2
            this.height = tileSize * 2
            this.x = 96
            this.y = tileSize * 3
            this.frameX = imgX
            this.frameY = imgY
            this.moveX = 0
        }
        draw(context) {
            context.drawImage(this.img, this.frameX, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(input) {
            this.x += this.moveX
            if (input.keys.indexOf("KeyD") > -1 || input.keys.indexOf("right") > -1) {
                this.moveX = 2
            } else if (input.keys.indexOf("KeyA") > -1 || input.keys.indexOf("left") > -1) {
                this.moveX = -2
            } else {
                this.moveX = 0
            }
        }
    }

    // Handle Inputs
    class InputHandler {
        constructor() {
            this.keys = []
            window.addEventListener("keydown", (e) => {
                if ((e.code == "KeyW" ||
                     e.code == "KeyD" ||
                     e.code == "KeyS" ||
                     e.code == "KeyA" ||
                     e.code == "Space")
                     && this.keys.indexOf(e.code) === -1) {
                        this.keys.push(e.code)
                     }
            })
            window.addEventListener("keyup", (e) => {
                if (e.code == "KeyW" ||
                    e.code == "KeyD" ||
                    e.code == "KeyS" ||
                    e.code == "KeyA" ||
                    e.code == "Space") {
                    this.keys.splice(this.keys.indexOf(e.code), 1)
                    }
            })
        }
    }

    // Handle inputs
    const handleInputs = (e) => {
        const speedControls = ["KeyW", "KeyS", "ArrowUp", "ArrowDown", "Space"]

        if (speedControls.includes(e.code)) {
            if (e.code == "KeyW" || e.code == "ArrowUp") {
                velocity += 0.1
            } else if (e.code == "KeyS" || e.code == "ArrowDown") {
                velocity -= 0.1
            } else if (e.code == "Space") {
                velocity = 0
            }
        }
    }

    // Spawn traffic
    class Car {
        constructor(spawnX, spawnY, imgX, imgY, carSpeed, image, direction) {
            this.width = tileSize * 2
            this.height = tileSize * 2
            this.x = spawnX
            this.y = spawnY
            this.img = image
            this.frameX = imgX
            this.frameY = imgY
            this.speed = carSpeed
            this.goingUp = direction
            this.markedForDeletion = false
        }
        draw(context) {
            if (!this.markedForDeletion) {
                context.drawImage(this.img, this.frameX, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
            }
        }
        update() {
            if (this.goingUp) {
                this.y -= (this.speed - velocity)
            } else {
                this.y += (this.speed + velocity)
            }
            if (this.y < 0 - (this.height * 2) || this.y > gameHeight + (this.height * 2)) {
                this.markedForDeletion = true
            }
            if (
                player.x + player.width - 32 > this.x &&
                player.x < this.x + this.width - 32 &&
                player.y + player.height - 8 > this.y &&
                player.y < this.y + this.height - 8
            ) {
                gameOver = true;
            }
            
        }
    }

    const isCarOnLane = (x, y, width, height, lane) => {
        const carsArray = lane === 'up' ? carUpArray : carDownArray;
        return carsArray.some(car => !(x + width < car.x || car.x + car.width < x || y + height < car.y || car.y + car.height < y));
    };    

    const handleCars = (deltaTime) => {
        const images = [0, 64, 128, 192]
        const carSpeed = 0.8
        if (carUpArray.length < 3) {
            if (carUpTimer > carUpInterval + carUpRandomInterval) {
                let spawnY = velocity > carSpeed ? -64 : 288
                let spawnX = Math.random() < 0.5 ? 32 : 96
                let imageX = images[Math.floor(Math.random() * images.length)]
                let imageY = Math.random() < 0.5 ? 0 : 64
                const newCar = new Car(spawnX, spawnY, imageX, imageY, carSpeed, carsImg, true)
                carUpArray.push(newCar)
                carUpRandomInterval = Math.random() * 2000 + 2000
                carUpTimer = 0
            } else {
                carUpTimer += deltaTime
            }
        }
        if (carDownArray.length < 3) {
            if (carDownTimer > carDownInterval + carDownRandomInterval) {
                let spawnY = velocity < carSpeed + velocity ? -64 : 288
                let spawnX = Math.random() < 0.5 ? 160 : 224
                let imageX = images[Math.floor(Math.random() * images.length)]
                let imageY = Math.random() < 0.5 ? 0 : 64
                const newCar = new Car(spawnX, spawnY, imageX, imageY, carSpeed, carsDownImg, false)
                carDownArray.push(newCar)
                carDownRandomInterval = Math.random() * 2000 + 2000
                carDownTimer = 0
                console.log("Car down")
                console.log(newCar)
            } else {
                carDownTimer += deltaTime
            }
        }
        carUpArray.forEach(car => {
            car.draw(ctx)
            car.update()
        })
        carUpArray = carUpArray.filter(car => !car.markedForDeletion)
        carDownArray.forEach(car => {
            car.draw(ctx)
            car.update()
        })
        carDownArray = carDownArray.filter(car => !car.markedForDeletion)


    }

    const showCars = () => carDisplay.style.display = "block"

    const chooseCar = () => {
        startBtn.removeEventListener("click", showCars)
        let color = document.querySelector("input[name='color']:checked").value
        let type = document.querySelector("input[name='type']:checked").value

        let x = 0
        let y = (type == "sedan") ? 0 : 64
        switch (color) {
            case "red":
                x = 0;
                break;
            case "blue":
                x = 64;
                break;
            case "green":
                x = 128;
                break;
            case "purple":
                x = 192;
                break;
        }
        player = new Player(x, y)
        carDisplay.style.display = "none"
        runGame(0)
        displayStats()
    }

    const displayStats = () => {
        let startTime = setInterval(() => {
            time++
            score += Math.round(2 * velocity)
            timeDisplay.innerHTML = time
            scoreDisplay.innerHTML = score
            if (gameOver) {
                clearInterval(startTime)
                timeDisplay.innerHTML = "GAME OVER!"
                document.getElementById("time").innerHTML = time
                document.getElementById("result").innerHTML = score
                document.getElementById("game-over").style.display = "block"
            }
        }, 1000)
    }

    const background = new Background()
    const input = new InputHandler()

    const runGame = (timeStamp) => {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        background.update(input)
        player.draw(ctx)
        player.update(input)
        handleCars(deltaTime)
        window.addEventListener("keydown", handleInputs)
        if (!gameOver) {
            requestAnimationFrame(runGame)
        }
    }

    selectCar.addEventListener("click", chooseCar)
    startBtn.addEventListener("click", showCars)
    resetBtn.addEventListener("click", () => {
        location.reload()
    })
})