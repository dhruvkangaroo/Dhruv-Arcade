window.addEventListener("load", () => {
    const startBtn = document.getElementById("start")
    const resetBtn = document.getElementById("reset")

    const scoreDisplay = document.getElementById("score")
    const timeDisplay = document.getElementById("timer")

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    const gunImg = new Image()
    gunImg.src = "../assets/images/goose/gun.png"
    const gooseImg = new Image()
    gooseImg.src = "../assets/images/goose/goose.png"
    const bgImg = new Image()
    bgImg.src = "../assets/images/goose/background.png"
    const grassImg = new Image()
    grassImg.src = "../assets/images/goose/grass.png"
    const movingGrassImg = new Image()
    movingGrassImg.src = "../assets/images/goose/movinggrass.png"
    const treeImg = new Image()
    treeImg.src = "../assets/images/goose/trees.png"

    const gameWidth = 320
    const gameHeight = 288
    const tileSize = 32
    let gooseArray = []
    let bulletArray = []
    let grassArray = []
    let gooseTimer = 0
    let gooseInterval = 3000
    let bulletInterval = 0
    let randomGooseInterval = Math.random() * 1000 + 1000
    let lastTime = 0
    let gameOver = false
    let time = 60
    let score = 0

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

    class Foreground {
        constructor(spawnX, spawnY, fgImg, imgX, imgWidth, imgHeight) {
            this.img = fgImg
            this.x = spawnX
            this.y = spawnY
            this.frameX = imgX
            this.width = imgWidth
            this.height = imgHeight
        }
        draw(context) {
            context.drawImage(this.img, this.frameX, 0, this.width, this.height, this.x, this.y, this.width, this.height)
        }
    }

    class Player {
        constructor() {
            this.width = tileSize
            this.height = tileSize * 2
            this.x = 144
            this.y = gameHeight - this.height
            this.img = gunImg
            this.frameX = 64
            this.frameY = 0
            this.facing = "up"
            this.shooting = false
        }
        draw(context) {
            context.drawImage(this.img, this.frameX, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(input) {
            if (input == "KeyD" && this.frameX < 128) {
                this.frameX += 32
            } else if (input == "KeyA" && this.frameX > 0) {
                this.frameX -= 32
            }
        }
        shoot(input) {
            let bulletX = 159
            let bulletY = 228
            let speedY = -2
            let speedX = 0
            if (input == "Space") {
                this.shooting = true
                switch (this.frameX) {
                    case 0:
                        bulletX = 124
                        speedX = -1.8
                        break
                    case 32:
                        bulletX = 142
                        speedX = -0.9
                        break
                    case 96:
                        bulletX = 176
                        speedX = 0.9
                        break
                    case 128:
                        bulletX = 190
                        speedX = 1.8
                        break
                }
            }
            handleBullets(bulletX, bulletY, speedX, speedY)
        }
    }

    const handleInputs = (e) => {
        let input = e.code
        if (input == "KeyD" || input == "KeyA") {
            player.update(input)
        } else if (input == "Space") {
            player.shoot(input)
        }
    }

    class Bullet {
        constructor(bulletX, bulletY, speedX, speedY) {
            this.x = bulletX
            this.y = bulletY
            this.speedX = speedX
            this.speedY = speedY
            this.width = 2
            this.height = 2
            this.color = "black"
            this.markedForDeletion = false
        }
        draw(context) {
            if (!this.markedForDeletion) {
                context.fillStyle = this.color
                context.fillRect(this.x, this.y, this.width, this.height)
            }
        }
        update() {
            this.x += this.speedX
            this.y += this.speedY
            if (this.x < 0 || this.y < 0 || this.x > gameWidth || this.y > gameHeight) {
                this.markedForDeletion = true
            }
        }
    }

    const handleBullets = (bulletX, bulletY, speedX, speedY) => {
        if (bulletInterval <= 0 && player.shooting) {
            bulletArray.push(new Bullet(bulletX, bulletY, speedX, speedY))
            bulletInterval += 100
            player.shooting = false
        } else if (bulletInterval > 0) {
            bulletInterval--
            player.shooting = false
        } else {
            bulletInterval = 0
            player.shooting = false
        }

        bulletArray.forEach(bullet => {
            bullet.draw(ctx)
            bullet.update()
        })

        bulletArray = bulletArray.filter(bullet => !bullet.markedForDeletion)
    }

    class Goose {
        constructor(spawnX, imgY, movingTo) {
            this.width = tileSize
            this.height = tileSize
            this.x = spawnX
            this.y = 224
            this.img = gooseImg
            this.frameX = 0
            this.frameY = imgY
            this.fps = 10
            this.frameCount = 1
            this.frameTimer = 0
            this.frameInterval = 2000/this.fps
            this.speed = 0.2
            this.direction = movingTo
            this.shot = false
            this.markedForDeletion = false
        }
        draw(context) {
            if (!this.markedForDeletion) {
                context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
            }
        }
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.frameCount) {
                    this.frameX = 0
                } else {
                    this.frameX++
                }
                this.frameTimer = 0
            } else {
                this.frameTimer += deltaTime
            }

            // Moving
            if (!this.shot) {
                if (this.direction == "right") {
                    this.x += this.speed
                    this.y -= this.speed
                } else if (this.direction == "left") {
                    this.x -= this.speed
                    this.y -= this.speed
                } else {
                    this.y -= this.speed
                }                
            } else {
                this.frameY = 96
                this.frameCount = 0
                this.y += this.speed * 2
            }
            // Delete the goose
            if (this.y > gameHeight - 64 || this.y < 0) {
                if (this.y > gameHeight - 64) {
                    score += 1
                }
                this.markedForDeletion = true
            }

            bulletArray.forEach(bullet => {
                const distanceX = bullet.x - (this.x + this.width / 2)
                const distanceY = bullet.y - (this.y + this.width / 2)
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
                if (distance < bullet.width + this.width / 3) {
                    this.shot = true
                } 
            })
        }
    }

    const handleGeese = (deltaTime) => {
        let spawnX = 0
        let imgY = 0
        let movingTo = ""
        if (gooseTimer > gooseInterval + randomGooseInterval) {
            spawnX = Math.floor(Math.random() * 9) * 32
            if (spawnX < 96) {
                imgY = 32
                movingTo = "right"
            } else if (spawnX > 192) {
                imgY = 64
                movingTo = "left"
            } else {
                if (spawnX == 128 || spawnX == 160) {
                    spawnX = 144
                }
                imgY = 0
                movingTo = "up"
            }
            const newGoose = new Goose(spawnX, imgY, movingTo)
            const newGrass = new MovingGrass(spawnX)
            gooseArray.push(newGoose)
            grassArray.push(newGrass)
            randomGooseInterval = Math.random() * 4000 + 2500
            gooseTimer = 0
        } else {
            gooseTimer += deltaTime
        }
        gooseArray.forEach(goose => {
            goose.draw(ctx)
            goose.update(deltaTime)
        })
        gooseArray = gooseArray.filter(goose => !goose.markedForDeletion)
    }

    class MovingGrass {
        constructor(spawnX) {
            this.img = movingGrassImg
            this.x = spawnX
            this.y = 160
            this.width = tileSize
            this.height = tileSize
            this.frameX = 0
            this.frameY = 0
            this.frameCount = 1
            this.fps = 5
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.speed = 0.5
            this.lifeTimer = 0
            this.markedForDeletion = false
        }
        draw(context) {
            if (!this.markedForDeletion) {
                context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
            }
        }
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.frameCount) {
                    this.frameX = 0
                } else {
                    this.frameX++
                }
                this.frameTimer = 0
            } else {
                this.frameTimer += deltaTime
            }
            this.lifeTimer += deltaTime
            if (this.lifeTimer >= 4000) {
                this.markedForDeletion = true
            }
        }
    }

    const handleGrass = (deltaTime) => {
        grassArray.forEach(grass => {
            grass.draw(ctx)
            grass.update(deltaTime)
        })
        grassArray = grassArray.filter(grass => !grass.markedForDeletion)
    }

    const background = new Background()
    const leftTree = new Foreground(0, 32, treeImg, 0, 64, 192)
    const rightTree = new Foreground(gameWidth - 64, 32, treeImg, 64, 64, 192)
    const grass = new Foreground(0, gameHeight - 128, grassImg, 0, gameWidth, 128)
    const player = new Player()

    const displayStats = () => {
        let countdown = setInterval(() => {
            time--
            timeDisplay.innerHTML = time
            scoreDisplay.innerHTML = score
            if (time <= 0) gameOver = true
            if (gameOver) {
                clearInterval(countdown)
                timeDisplay.innerHTML = "GAME OVER!"
                document.getElementById("result").innerHTML = score
                document.getElementById("game-over").style.display = "block"
            }
        }, 1000)
    }    

    const startGame = () => {
        startBtn.removeEventListener("click", startGame)
        window.addEventListener("keydown", handleInputs)
        displayStats()
        runGame(0)
    }

    const runGame = (timeStamp) => {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        handleGeese(deltaTime)
        leftTree.draw(ctx)
        rightTree.draw(ctx)
        grass.draw(ctx)
        player.draw(ctx)
        player.update()
        handleGrass(deltaTime)
        handleBullets()

        if (!gameOver) {
            requestAnimationFrame(runGame)
        }
    }

    startBtn.addEventListener("click", startGame)
    resetBtn.addEventListener("click", () => {
        location.reload()
    })
})