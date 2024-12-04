window.addEventListener("load", function() {
    window.oncontextmenu = (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        return false
    }
    
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    const startBtn = document.getElementById("start")
    const reset = document.getElementById("reset")
    const currentWave = document.getElementById("wave")
    const scoreDisplay = document.getElementById("score")
    const endWave = document.getElementById("wave-count")
    const endResult = document.getElementById("result")

    const playerImg = new Image()
    playerImg.src = "../assets/images/survive/player.png"
    const zombieImg = new Image()
    zombieImg.src = "../assets/images/survive/zombie.png"
    const damagedZombieImg = new Image()
    damagedZombieImg.src = "../assets/images/survive/zombie-damaged.png"
    const bgImg = new Image()
    bgImg.src = "../assets/images/survive/background.png"
    const fogImg = new Image()
    fogImg.src = "../assets/images/survive/fog.png"

    const gameWidth = 320
    const gameHeight = 320
    const tileSize = 32
    let wave = 0
    let score = 0
    let zombies = []
    let bullets = []
    let lastTime = 0
    let bulletInterval = 0
    let maxZombies = 0
    let currentZombies = 0
    let spawned = 0
    let zombieTimer = 0
    let zombieInterval = 1000
    let randomZombieInterval = Math.random() * 1000 + 1000 
    let gameOver = false

    // Player class
    class Player {
        constructor() {
            this.width = tileSize
            this.height = tileSize
            this.x = 144
            this.y = 144
            this.img = playerImg
            this.frameX = 0
            this.frameY = 0
            this.frameCount = 3
            this.fps = 6
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.moveX = 0
            this.moveY = 0
            this.shooting = false
        }
        draw(context, deltaTime, zombies) {
            // Check for collision with zombies
            zombies.forEach(zombie => {
                const distanceX = zombie.x - this.x
                const distanceY = zombie.y - this.y
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
                if (distance < zombie.width / 3 + this.width / 3) {
                    gameOver = true
                }
            })
            // Update frames
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
            // Draw image
            context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(input) {
            // Move player and update frameY
            this.x += this.moveX
            this.y += this.moveY
            if (input.keys.indexOf("KeyD") > -1 || input.keys.indexOf("right") > -1) {
                this.moveX = 1
                this.frameY = 32
            } else if (input.keys.indexOf("KeyA") > -1 || input.keys.indexOf("left") > -1) {
                this.moveX = -1
                this.frameY = 64
            } else if (input.keys.indexOf("KeyW") > -1 || input.keys.indexOf("up") > -1) {
                this.moveY = -1
                this.frameY = 96
            } else if (input.keys.indexOf("KeyS") > -1 || input.keys.indexOf("down") > -1) {
                this.moveY = 1
                this.frameY = 0
            } else {
                this.moveX = 0
                this.moveY = 0
            }
        }
        shoot(input, handleBullets) {
            // Shoot, set start coords for bullets, call handleBullets
            let bulletX = 0
            let bulletY = 0
            let speedX = 0
            let speedY = 0
            if (input.keys.indexOf("Space") > -1 || input.keys.indexOf("fire") > -1) {
                this.shooting = true
                const damage = 5
                if (this.frameY == 0) {
                    speedY = 4
                    bulletX = this.x + this.width / 2
                    bulletY = this.y + this.width
                } else if (this.frameY == 32) {
                    speedX = 4
                    bulletX = this.x + this.width
                    bulletY = this.y + this.width / 2
                } else if (this.frameY == 64) {
                    speedX = -4
                    bulletX = this.x
                    bulletY = this.y + this.width / 2
                } else {
                    speedY = -4
                    bulletX = this.x + this.width / 2
                    bulletY = this.y
                }
                handleBullets(bulletX, bulletY, speedX, speedY, damage)
            }
        }
    }

    // Handle inputs
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
            window.addEventListener("touchstart", (e) => {
                if ((e.target.id == "left"||
                     e.target.id == "up" ||
                     e.target.id == "down" ||
                     e.target.id == "right" ||
                     e.target.id == "fire")
                     && this.keys.indexOf(e.target.id) === -1) {
                        this.keys.push(e.target.id)
                     }
            })
            window.addEventListener("mousedown", (e) => {
                if ((e.target.id == "left"||
                     e.target.id == "up" ||
                     e.target.id == "down" ||
                     e.target.id == "right" ||
                     e.target.id == "fire")
                     && this.keys.indexOf(e.target.id) === -1) {
                        this.keys.push(e.target.id)
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
            window.addEventListener("touchend", (e) => {
                if (e.target.id == "left"||
                    e.target.id == "up" ||
                    e.target.id == "down" ||
                    e.target.id == "right" ||
                    e.target.id == "fire") {
                    this.keys.splice(this.keys.indexOf(e.target.id), 1)
                    }
            })
            window.addEventListener("mouseup", (e) => {
                if (e.target.id == "left"||
                    e.target.id == "up" ||
                    e.target.id == "down" ||
                    e.target.id == "right" ||
                    e.target.id == "fire") {
                    this.keys.splice(this.keys.indexOf(e.target.id), 1)
                    }
            })
        }
    }

    // Handle bullets
    class Bullet {
        constructor(bulletX, bulletY, speedX, speedY, damage) {
            this.gameWidth = gameWidth
            this.x = bulletX
            this.y = bulletY
            this.speedX = speedX
            this.speedY = speedY
            this.damage = damage
            this.width = 2
            this.height = 2
            this.color = "white"
            this.markedForDeletion = false
        }
        draw(context) {
            // Draw bullet if not marked for deletion
            if (!this.markedForDeletion) {
                context.fillStyle = this.color
                context.fillRect(this.x, this.y, this.width, this.height)
            }
        }
        update() {
            // Update bullets, delete if off screen
            this.x += this.speedX
            this.y += this.speedY
            if (this.x < 0 - this.gameWidth || this.y < 0 - this.gameWidth) {
                this.markedForDeletion = true
            }
        }
    }

    // Handle bullets
    function handleBullets(bulletX, bulletY, speedX, speedY, damage) {
        // If bullet interval ok and player is shooting then can shoot
        if (bulletInterval <= 0 && player.shooting) {
            bullets.push(new Bullet(bulletX, bulletY, speedX, speedY, damage))
            bulletInterval += 100
            player.shooting = false
        } else if (bulletInterval > 0) {
            bulletInterval--
            player.shooting = false
        } else {
            bulletInterval = 0
            player.shooting = false
        }
        bullets.forEach(bullet => {
            bullet.draw(ctx)
            bullet.update()
        })
        // Filter the bullets for whether they're marked for deletion
        bullets = bullets.filter(bullet => !bullet.markedForDeletion)
    }


    // Background - static for now
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

    // Enemies
    class Zombie {
        constructor(spawnX, spawnY) {
            this.width = tileSize
            this.height = tileSize
            this.x = spawnX
            this.y = spawnY
            this.img = zombieImg
            this.frameX = 0
            this.frameY = 0
            this.frameCount = 3
            this.fps = 10
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.speed = 0.25
            this.health = 10
            this.markedForDeletion = false
        }
        draw(context) {
            // Draw zombie if not marked for deletion
            if (!this.markedForDeletion) {
                context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
            }
        }
        update(deltaTime, bullets, player) {
            // Update frames
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
            // Check for collision with bullets
            bullets.forEach(bullet => {
                const distanceX = bullet.x - (this.x + this.width / 2)
                const distanceY = bullet.y - (this.y + this.width / 2)
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
                if (distance < bullet.width + this.width / 3) {
                    // Change img if damaged, delete if dead
                    if (this.health > 5) {
                        bullet.markedForDeletion = true
                        this.health -= bullet.damage
                        this.img = damagedZombieImg
                    } else {
                        this.markedForDeletion = true
                    }
                }
            })
            // Chase player
            let distToPlayerX = player.x - this.x
            let distToPlayerY = player.y - this.y
            let distToCover = Math.sqrt(distToPlayerX * distToPlayerX + distToPlayerY * distToPlayerY)
            if (distToCover) {
                distToPlayerX /= distToCover
                distToPlayerY /= distToCover
            }
            this.x += distToPlayerX * this.speed
            this.y += distToPlayerY * this.speed
            // Change frameY depending on where zombie facing
            let angle = Math.atan2(distToPlayerX, distToPlayerY)
            if (angle >= -2.5 && angle < -1) {
                this.frameY = 32
            } else if (angle >= -1 && angle <= 1) {
                this.frameY = 0
            } else if (angle > 1 && angle <= 2.5) {
                this.frameY = 64
            } else {
                this.frameY = 96
            }
        }
    }

    function handleZombies(deltaTime, bullets, player) {
        let spawnX = 0
        let spawnY = 0
        // Spawn zombies if not at max
        if (spawned < maxZombies) {
            if (zombieTimer > zombieInterval + randomZombieInterval) {
                let spawn = Math.random() < 0.5 ? "x" : "y"
                let position = Math.random() < 0.5 ? 0 : 288
                if (spawn == "x") {
                    spawnX = position
                    spawnY = Math.floor(Math.random() * 288)
                    zombies.push(new Zombie(spawnX, spawnY))
                } else {
                    spawnY = position
                    spawnX = Math.floor(Math.random() * 288)
                    zombies.push(new Zombie(spawnX, spawnY))
                }
                randomZombieInterval = Math.random() * 1000 + 1000
                zombieTimer = 0
                spawned++
            } else {
                zombieTimer += deltaTime
            }
        }
        zombies.forEach(zombie => {
            zombie.draw(ctx)
            zombie.update(deltaTime, bullets, player)
            if (zombie.markedForDeletion) {
                // Update score, decrease currentZombies when deleted
                score++
                currentZombies--
            }
        })
        // Filter zombie array to remove deleted zombies
        zombies = zombies.filter(zombie => !zombie.markedForDeletion)
    }

    // Check wave / status / gameover
    function displayStatus() {
        scoreDisplay.innerHTML = score
        currentWave.innerHTML = wave
        if (!gameOver) {
            if (currentZombies === 0) {
                maxZombies += 4
                currentZombies = maxZombies
                spawned = 0
                wave++
            }
        } else {
            endWave.innerHTML = wave
            endResult.innerHTML = score
            document.querySelector("#game-over").style.display="block"
            startBtn.addEventListener("click", startGame)
        }  
    }

    // Run game
    const background = new Background()
    const player = new Player()
    const input = new InputHandler()

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        player.draw(ctx, deltaTime, zombies)
        player.update(input)
        player.shoot(input, handleBullets)
        handleZombies(deltaTime, bullets, player)
        handleBullets()
        displayStatus()
        ctx.drawImage(fogImg, 0, 0, gameWidth, gameHeight)
        if (!gameOver) {
            requestAnimationFrame(animate)
        }
    }

    // Start Game
    function startGame() {
        animate(0)
        startBtn.removeEventListener("click", startGame)
    }

    startBtn.addEventListener("click", startGame)
    reset.addEventListener("click", () => {
    location.reload() 
    })
})