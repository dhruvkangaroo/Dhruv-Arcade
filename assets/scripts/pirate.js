const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const playerImg = new Image()
playerImg.src = "../assets/images/pirate/player.png"
const shipImg = new Image()
shipImg.src = "../assets/images/pirate/ship.png"
const compassImg = new Image()
compassImg.src = "../assets/images/pirate/compass.png"
const arrowImg = new Image()
arrowImg.src = "../assets/images/pirate/arrow.png"
const bgImg = new Image()
bgImg.src = "../assets/images/pirate/sea.png"

const gameWidth = 320
const gameHeight = 320
const tileSize = 32
let enemyTimer = 10000
let enemyInterval = Math.random() * 10000 + 5000
let wind = {}
let playerShip = {}
let enemyShips = []
let playerBalls = []
let enemyBalls = []
let lastTime = 0
let gameOver = false
let sunkShips = 0

class Background {
    constructor() {
        this.img = bgImg
        this.x = 0
        this.y = 0
        this.width = gameWidth
        this.height = gameHeight
        this.speed = 0.5
        this.speedX = 0
        this.speedY = 0
        this.windDirection = 0
    }
    draw(context) {
        context.drawImage(this.img, this.x, this.y, this.width, this.height)
        
        if (this.x < 0 && this.y < 0) {
            context.drawImage(this.img, this.x + this.width - 1, this.y + this.height - 1, this.width, this.height);
        } else if (this.x < 0 && this.y > 0) {
            context.drawImage(this.img, this.x + this.width - 1, this.y - this.height + 1, this.width, this.height);
        } else if (this.x > 0 && this.y < 0) {
            context.drawImage(this.img, this.x - this.width + 1, this.y + this.height - 1, this.width, this.height);
        } else if (this.x > 0 && this.y > 0) {
            context.drawImage(this.img, this.x - this.width + 1, this.y - this.height + 1, this.width, this.height);
        }
    
        if (this.x < 0) {
            context.drawImage(this.img, this.x + this.width - 1, this.y, this.width, this.height);
        } else if (this.x > 0) {
            context.drawImage(this.img, this.x - this.width + 1, this.y, this.width, this.height);
        }
    
        if (this.y < 0) {
            context.drawImage(this.img, this.x, this.y + this.height - 1, this.width, this.height);
        } else if (this.y > 0) {
            context.drawImage(this.img, this.x, this.y - this.height + 1, this.width, this.height);
        }
    
        if (this.x + this.width < this.width) {
            context.drawImage(this.img, this.x + this.width - 1, this.y, this.width, this.height);
        } else if (this.x + this.width > this.width) {
            context.drawImage(this.img, this.x - this.width + 1, this.y, this.width, this.height);
        }
    
        if (this.y + this.height < this.height) {
            context.drawImage(this.img, this.x, this.y + this.height - 1, this.width, this.height);
        } else if (this.y + this.height > this.height) {
            context.drawImage(this.img, this.x, this.y - this.height + 1, this.width, this.height);
        }
    }
    update(player, wind) {
        // Initialise variables which will be reset every update
        let backgroundMovementRadians = 0
        let backgroundVelocity = 0
        let speed = 0
        // If the player's actively sailing
        if (player.sails > 0) {
            // Update speed based on this speed and the player's sails
            speed = this.speed * player.sails

            // Caculate the difference between the wind direction and direction player is facing
            let playerFacingRadians = player.angle

            let windDirectionObject = wind.directions.find(obj => Object.keys(obj)[0] === wind.direction)
            let windDirectionRadians = windDirectionObject ? Object.values(windDirectionObject)[0] : 0

            let angleDifference = playerFacingRadians - windDirectionRadians
    
            if (angleDifference > Math.PI) {
                angleDifference -= 2 * Math.PI
            } else if (angleDifference < -Math.PI) {
                angleDifference += 2 * Math.PI
            }

            // Set a threshold for player to be affected by the wind
            let thresholdAngle = Math.PI / 4

            // If the difference in the wind/player angle is less than the threshold, move!(background)
            if (Math.abs(angleDifference) < thresholdAngle) {
                backgroundMovementRadians = playerFacingRadians + Math.PI / 2
                backgroundVelocity = {
                    x: speed * Math.cos(backgroundMovementRadians),
                    y: speed * Math.sin(backgroundMovementRadians)
                }

                // Update position of background based on velocity
                this.x += backgroundVelocity.x
                this.y += backgroundVelocity.y

                // Wrap background
                if (this.x > this.width) {
                    this.x -= this.width
                } else if (this.x < -this.width) {
                    this.x += this.width
                }

                if (this.y > this.height) {
                    this.y -= this.height
                } else if (this.y < -this.height) {
                    this.y += this.height
                }
            }
        } 
        // Reset speed if background velocity is 0 (even if player sails are > 0)
        if (backgroundVelocity == 0) {
            speed = 0
        }
        // Update/reset speedX and speedY for use in enemy update method so can move relative to background 
        if (speed > 0) {
            const backgroundSpeedMagnitude = Math.sqrt(backgroundVelocity.x ** 2 + backgroundVelocity.y ** 2);
            const backgroundMovementAngle = Math.atan2(backgroundVelocity.y, backgroundVelocity.x);
        
            this.speedX = backgroundSpeedMagnitude * Math.cos(backgroundMovementAngle);
            this.speedY = backgroundSpeedMagnitude * Math.sin(backgroundMovementAngle);
        } else {
            this.speedX = 0
            this.speedY = 0
        }
    }
}

class Player {
    constructor() {
        this.img = playerImg
        this.x = gameWidth / 2
        this.y = gameHeight / 2
        this.width = tileSize * 2
        this.frameX = 0
        this.frameY = 0
        this.speed = 0
        this.sails = 0
        this.angle = 0
        this.sailsChangeTimer = 0
        this.sailsChangeInterval = 1000
        this.cannonTimer = 1000
        this.cannonInterval = 1000
        this.health = 100
        this.strength = 10
    }
    draw(ctx) {
        ctx.save()
        ctx.translate(gameWidth / 2, gameHeight / 2)
        ctx.rotate(this.angle)
        ctx.drawImage(this.img, this.frameX, this.frameY, this.width, this.width, -this.width / 2, -this.width / 2, this.width, this.width)
        ctx.restore()
    }
    update(deltaTime) {
        // Rotate player left and right
        if (input.keys.includes("KeyA")) {
            this.angle -= Math.PI / 180
        }
        if (input.keys.includes("KeyD")) {
            this.angle += Math.PI / 180
        }

        // Raise and lower sails, timer prevents rapid scrolling through frames
        if (this.sailsChangeTimer > this.sailsChangeInterval) {
            if (input.keys.includes("KeyS") && this.sails > 0) {
                this.sails--
                this.frameX -= 64
                this.sailsChangeTimer = 0
            }
            if (input.keys.includes("KeyW") && this.sails < 2) {
                this.sails++
                this.frameX += 64
                this.sailsChangeTimer = 0
            }            
        } else {
            this.sailsChangeTimer += deltaTime
        }

        // Fire cannons left and right, timer prevents rapid fire of cannons
        if (this.cannonTimer > this.cannonInterval) {
            if (input.keys.includes("KeyE")) {
                fireCannon(this, "right")
                this.cannonTimer = 0
            }
            if (input.keys.includes("KeyQ")) {
                fireCannon(this, "left")
                this.cannonTimer = 0

            }
        } else {
            this.cannonTimer += deltaTime
        }

        if (this.health > 50) {
            this.frameY = 0
        } else if (this.health > 30) {
            this.frameY = 64
        } else if (this.health > 0) {
            this.frameY = 128
        } else {
            setTimeout(() => {
                gameOver = true
            }, 500)
        }

    }
}

class EnemyShip {
    constructor(posX, posY) {
        this.img = shipImg
        this.x = posX
        this.y = posY
        this.width = tileSize * 2
        this.frameX = 0
        this.frameY = 0
        this.speed = 0.4
        this.sails = 0
        this.angle = 0
        this.sailsChangeTimer = 0
        this.sailsChangeInterval = 1000
        this.cannonTimer = 0
        this.cannonInterval = 1500
        this.aimlessTimer = 2000
        this.aimlessInterval = 2000
        this.health = 100
        this.strength = 3
        this.chaseRadius = 140
        this.dangerRadius = 80
        this.rotationSpeed = 0.05
        this.markedForDeletion = false
    }
    draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.drawImage(this.img, this.frameX, this.frameY, this.width, this.width, -this.width / 2, -this.width / 2, this.width, this.width)
        ctx.restore()
    }
    update(player, deltaTime, background) {
        let speed = this.speed * this.sails

        // Calculate distance and angle to player
        const distanceToPlayer = Math.sqrt((this.x - player.x) ** 2 + (this.y - player.y) ** 2)
        const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x)

        // Update speed
        if (distanceToPlayer < this.chaseRadius) {
            if (player.sails != 0) {
                this.sails = player.sails
            } else {
                this.sails = 1
            }
        } else if (distanceToPlayer > this.chaseRadius) {
            this.sails = 1
        }

        if (distanceToPlayer < this.dangerRadius) {
            // Inside dangerRadius turn side to player and fire cannons
            const angleDifference = angleToPlayer - this.angle
            const shortestRotation = Math.atan2(Math.sin(angleDifference), Math.cos(angleDifference))
            const sideToTurn = shortestRotation > 0 ? -1 : 1
            const rotation = sideToTurn * Math.min(Math.abs(shortestRotation), this.rotationSpeed)
            
            this.angle += rotation

            if (this.cannonTimer > this.cannonInterval) {
                fireCannon(this, angleDifference > 0 ? "right" : "left")
                this.cannonTimer = 0
            } else {
                this.cannonTimer += deltaTime
            }
        } else if (distanceToPlayer < this.chaseRadius) {
            // Outside dangerRadius but inside chaseRadius, face player and try to chase
            const desiredAngle = angleToPlayer + Math.PI / 2
            const angleDifference = desiredAngle - this.angle
            const rotation = Math.sign(angleDifference) * Math.min(Math.abs(angleDifference), this.rotationSpeed)
            this.angle += rotation
            this.x += Math.cos(angleToPlayer) * speed
            this.y += Math.sin(angleToPlayer) * speed
        } else {
            if (this.aimlessTimer > this.aimlessInterval) {
                const randomAngle = Math.random() * 2 * Math.PI
                const rotation = Math.sign(randomAngle - this.angle) * this.rotationSpeed
                this.angle += rotation
                this.aimlessTimer = 0
            }
            const dx = Math.cos(this.angle - Math.PI / 2) * speed
            const dy = Math.sin(this.angle - Math.PI / 2) * speed
            this.x += dx
            this.y += dy
            this.aimlessTimer += deltaTime
        }

        // Update position based on background speedX and speedY to move relative to background
        this.x = this.x + background.speedX
        this.y = this.y + background.speedY
        
        // Change sprites for sails
        if (this.sails == 0) {
            this.frameX = 0
        } else if (this.sails == 1) {
            this.frameX = 64
        } else {
            this.frameX = 128
        }
        // Change sprite for damage
        if (this.health > 50) {
            this.frameY = 0
        }else if (this.health > 30) {
            this.frameY = 64
        } else if (this.health > 0) {
            this.frameY = 128
        } else {
            this.markedForDeletion = true
            sunkShips++
        }
    }
}

class Wind {
    constructor() {
        this.compass = compassImg
        this.arrow = arrowImg
        this.width = tileSize
        this.x = gameWidth - tileSize
        this.y = 0
        this.changeDirectionTimer = 0
        this.changeDirectionInterval = Math.random() * 10000 + 10000
        this.directions = [{"N": 0}, {"NE": Math.PI/4}, 
            {"E": Math.PI/2}, {"SE": 3*Math.PI/4}, {"S": Math.PI}, 
            {"SW": -3*Math.PI/4}, {"W": -Math.PI/2}, {"NW": -Math.PI/4}]
        this.direction = "N"
    }
    draw(ctx) {
        ctx.drawImage(this.compass, this.x, this.y)
        ctx.translate(this.x + this.width / 2, this.y + this.width / 2)
        let directionObj = this.directions.find(obj => Object.keys(obj)[0] === this.direction)
        let angle = directionObj ? Object.values(directionObj)[0] : 0
        ctx.rotate(angle)
        ctx.drawImage(this.arrow, -this.width / 2, -this.width / 2)
        ctx.rotate(-angle)
        ctx.translate(-(this.x + this.width / 2), -(this.y + this.width / 2))
    }
    update(deltaTime) {
        if (this.changeDirectionTimer > this.changeDirectionInterval) {
            let randomDirection = this.directions[Math.floor(Math.random() * this.directions.length)]
            this.direction = Object.keys(randomDirection)[0]
            this.changeDirectionTimer = 0
            this.changeDirectionInterval = Math.random() * 10000 + 10000
        } else {
            this.changeDirectionTimer += deltaTime
        }
    }
}

class CannonBall {
    constructor(x, y, angle, shooter) {
        this.x = x
        this.y = y
        this.startX = x
        this.startY = y
        this.angle = angle
        this.speed = 1
        this.radius = 2
        this.color = "black"
        this.dx = Math.cos(this.angle) * this.speed
        this.dy = Math.sin(this.angle) * this.speed
        this.markedForDeletion = false
        this.shooter = shooter
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
    }
    move(player, enemies) {
        this.x += this.dx
        this.y += this.dy

        // Collide with player
        this.collideWithTarget(player)

        // Collide with enemies
        for (let enemy of enemies) {
            if (this.collideWithTarget(enemy)) break
        }

        // Check if exceeds max distance
        const distanceSquared = (this.x - this.startX) ** 2 + (this.y - this.startY) ** 2
        const maxDistance = 60 ** 2

        if (distanceSquared > maxDistance) {
            this.markedForDeletion = true
        }

        if (this.x > gameWidth || this.x < 0 || this.y > gameHeight || this.y < 0) {
            this.markedForDeletion = true
        }
    }
    collideWithTarget(target) {
        // Don't collide with self!
        if (target === this.shooter) {
            return false
        }
        // Check distance to target and if within target radius hit!
        const distanceToTarget = (this.x - target.x) ** 2 + (this.y - target.y) ** 2
        const targetRadius = (target.width / 3) ** 2

        if (distanceToTarget < targetRadius) {
            target.health -= this.shooter.strength
            // Update the display to show player their health
            updateDisplay()
            this.markedForDeletion = true
            return true
        }
        return false
    }
}

class InputHandler {
    constructor() {
        this.keys = []
        window.addEventListener("keydown", (e) => {
            if ((e.code == "KeyW" ||
                 e.code == "KeyD" ||
                 e.code == "KeyS" ||
                 e.code == "KeyA" ||
                 e.code == "KeyE" ||
                 e.code == "KeyQ")
                 && this.keys.indexOf(e.code) === -1) {
                    this.keys.push(e.code)
                 }
        })
        window.addEventListener("keyup", (e) => {
            if (e.code == "KeyW" ||
                e.code == "KeyD" ||
                e.code == "KeyS" ||
                e.code == "KeyA" ||
                e.code == "KeyE" ||
                e.code == "KeyQ") {
                this.keys.splice(this.keys.indexOf(e.code), 1)
                }
        })
    }
}

const fireCannon = (ship, direction) => {
    const ballOffset = (direction == "left") ? -20 : 20
    const ballPositions = [-8, 4, 16]
    const angleAdjusted = (direction == "left") ? Math.PI : 0

    for (let i = 0; i < ballPositions.length; i++) {
        const cannonX = ship.x + ballOffset * Math.cos(ship.angle) - ballPositions[i] * Math.sin(ship.angle)
        const cannonY = ship.y + ballOffset * Math.sin(ship.angle) + ballPositions[i] * Math.cos(ship.angle)
        
        const firingAngle = ship.angle + angleAdjusted
        
        const cannonBall = new CannonBall(cannonX, cannonY, firingAngle, ship)
        if (ship == playerShip) {
            playerBalls.push(cannonBall)
        } else {
            enemyBalls.push(cannonBall)
        }
    }
}

const handleBalls = (ctx, player, enemies) => {
    playerBalls.forEach(ball => {
        ball.draw(ctx)
        ball.move(player, enemies)
    })
    playerBalls = playerBalls.filter(ball => !ball.markedForDeletion)
    enemyBalls.forEach(ball => {
        ball.draw(ctx)
        ball.move(player, enemies)
    })
    enemyBalls = enemyBalls.filter(ball => !ball.markedForDeletion)
}

const handleEnemies = (player, deltaTime, background) => {
    let spawnX = 0
    let spawnY = 0
    if (enemyTimer > enemyInterval) {
        let spawn = Math.random() < 0.5 ? "x" : "y"
        let position = Math.random() < 0.5 ? -32 : 352
        if (spawn == "x") {
            spawnX = position
            spawnY = Math.floor(Math.random() * 320)
            enemyShips.push(new EnemyShip(spawnX, spawnY))
        } else {
            spawnY = position
            spawnX = Math.floor(Math.random() * 320)
            enemyShips.push(new EnemyShip(spawnX, spawnY))
        }
        enemyInterval = Math.random() * 10000 + 5000
        enemyTimer = 0
    } else {
        enemyTimer += deltaTime
    }

    enemyShips.forEach(ship => {
        ship.draw(ctx)
        ship.update(player, deltaTime, background)
    })
    enemyShips = enemyShips.filter(ship => !ship.markedForDeletion)
}

const updateDisplay = () => {
    document.getElementById("player-health").innerHTML = playerShip.health
}

const startGame = () => {
    // Spawn the map and player boat
    wind = new Wind()
    playerShip = new Player()
    startBtn.removeEventListener("click", startGame)
    runGame(0)
}

const endGame = () => {
    document.getElementById("game-over").style.display = "block"
    document.getElementById("result").innerHTML = sunkShips
}

const input = new InputHandler()
const background = new Background()

const runGame = (timeStamp) => {
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    ctx.clearRect(0, 0, gameWidth, gameWidth)
    // draw and update stuff
    background.draw(ctx)
    background.update(playerShip, wind)
    wind.draw(ctx)
    wind.update(deltaTime)

    playerShip.draw(ctx)
    playerShip.update(deltaTime)
    handleEnemies(playerShip, deltaTime, background)
    handleBalls(ctx, playerShip, enemyShips)
    if (gameOver) {
        endGame()
    } else {
        requestAnimationFrame(runGame)
    }
}

startBtn.addEventListener("click", startGame)
resetBtn.addEventListener("click", () => {
    location.reload()
})