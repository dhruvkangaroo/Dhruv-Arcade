const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const penImg = new Image()
penImg.src = "../assets/images/sheepdog/pen.png"
const sheepImg = new Image()
sheepImg.src = "../assets/images/sheepdog/sheep.png"
const dogImg = new Image()
dogImg.src = "../assets/images/sheepdog/dog.png"

const gameWidth = 320
const gameHeight = 320

let flock = {}
let dog = {}
let pen = {}
let time = 0
let gameOver = false

class Pen {
    constructor(posX, posY) {
        this.img = penImg
        this.sheepImg = sheepImg
        this.x = posX
        this.y = posY
        this.width = 64
        this.height = 32
        this.pennedSheep = 0
        this.gap = 0
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        if (this.pennedSheep > 0) {
            for (let i = 0; i < this.pennedSheep; i++) {
                ctx.drawImage(this.sheepImg, this.x + (i * 7), this.y, 16, 16)
            }
        }
    }
    penSheep(sheeps) {
        sheeps.forEach(sheep => {
            if (sheep.position.x >= this.x &&
                sheep.position.x <= this.x + this.width &&
                sheep.position.y >= this.y &&
                sheep.position.y <= this.y + this.height) {
                    sheep.penned = true
                    this.pennedSheep++
                    document.getElementById("penned-sheep").innerHTML = this.pennedSheep
                    document.getElementById("loose-sheep").innerHTML = 8 - this.pennedSheep
                    if (this.pennedSheep == 8) {
                        setTimeout(() => {
                            gameOver = true
                        }, 1000)
                    }
                }
        })
    }
}

class Flock {
    constructor(numSheep) {
        this.sheeps = []
        for (let i = 0 ; i < numSheep ; i++) {
            const posX = Math.random() * gameWidth
            const posY = Math.random() * gameHeight
            this.sheeps.push(new Sheep(posX, posY))
        }
    }
    draw(ctx) {
        this.sheeps.forEach(sheep => sheep.draw(ctx))
    }
    update() {
        this.sheeps.forEach(sheep => sheep.update(this.sheeps))
        this.sheeps = this.sheeps.filter(sheep => !sheep.penned)
    }
}

class Sheep {
    constructor(posX, posY) {
        this.img = sheepImg
        this.position = { x: posX, y: posY }
        this.velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }
        this.acceleration = { x: 0, y: 0 }
        this.maxSpeed = 0.4
        this.maxForce = 0.05
        this.neighborRadius = 50
        this.avoidRadius = 20
        this.alignmentFactor = 0.5
        this.cohesionFactor = 0.05
        this.separationFactor = 2.0
        this.isStopped = false
        this.rotationOffset = -Math.PI / 2
        this.penned = false
    }

    draw(ctx) {
        const angle = Math.atan2(this.velocity.y, this.velocity.x) + this.rotationOffset;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(angle);
        ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
        ctx.restore();
    }

    update(flock) {
        this.acceleration = { x: 0, y: 0 }
        this.separation(flock)
        this.alignment(flock)
        this.cohesion(flock)

        if (!this.isStopped) {
            const speedVariationFactor = Math.random() * 0.2 + 0.9
            this.velocity.x *= speedVariationFactor
            this.velocity.y *= speedVariationFactor
        }

        const stopProbability = 0.01
        if (!this.isStopped && Math.random() < stopProbability) {
            this.isStopped = true
        }

        if (this.isStopped) {
            const startProbability = 0.1
            if (Math.random() < startProbability) {
                this.isStopped = false
                this.velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }
            }
        }

        this.velocity.x += this.acceleration.x
        this.velocity.y += this.acceleration.y

        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2)
        if (speed > this.maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * this.maxSpeed
            this.velocity.y = (this.velocity.y / speed) * this.maxSpeed
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.x < 0) {
            this.position.x = 0
            this.velocity.x *= -1
        } else if (this.position.x > canvas.width) {
            this.position.x = canvas.width
            this.velocity.x *= -1
        }
    
        if (this.position.y < 0) {
            this.position.y = 0
            this.velocity.y *= -1
        } else if (this.position.y > canvas.height) {
            this.position.y = canvas.height
            this.velocity.y *= -1
        }
    }

    separation(flock) {
        let moveX = 0
        let moveY = 0
        let count = 0

        for (const otherSheep of flock) {
            const distanceX = otherSheep.position.x - this.position.x
            const distanceY = otherSheep.position.y - this.position.y
            const distanceSq = distanceX * distanceX + distanceY * distanceY

            if (distanceSq > 0 && distanceSq < this.avoidRadius ** 2) {
                moveX -= distanceX
                moveY -= distanceY
                count++
            }
        }

        if (count > 0) {
            moveX /= count
            moveY /= count
            const magnitude = Math.sqrt(moveX * moveX + moveY * moveY)
            this.applyForce(moveX / magnitude, moveY / magnitude, this.separationFactor)
        }
    }

    alignment(flock) {
        let avgVelocityX = 0
        let avgVelocityY = 0
        let count = 0

        for (const otherSheep of flock) {
            const distanceX = otherSheep.position.x - this.position.x
            const distanceY = otherSheep.position.y - this.position.y
            const distanceSq = distanceX * distanceX + distanceY * distanceY

            if (distanceSq > 0 && distanceSq < this.neighborRadius ** 2) {
                avgVelocityX += otherSheep.velocity.x
                avgVelocityY += otherSheep.velocity.y
                count++
            }
        }

        if (count > 0) {
            avgVelocityX /= count
            avgVelocityY /= count
            const magnitude = Math.sqrt(avgVelocityX * avgVelocityX + avgVelocityY * avgVelocityY)
            this.applyForce(avgVelocityX / magnitude, avgVelocityY / magnitude, this.alignmentFactor)
        }
    }

    cohesion(flock) {
        let avgPosX = 0
        let avgPosY = 0
        let count = 0

        for (const otherSheep of flock) {
            const distanceX = otherSheep.position.x - this.position.x
            const distanceY = otherSheep.position.y - this.position.y
            const distanceSq = distanceX * distanceX + distanceY * distanceY

            if (distanceSq > 0 && distanceSq < this.neighborRadius ** 2) {
                avgPosX += otherSheep.position.x
                avgPosY += otherSheep.position.y
                count++
            }
        }

        if (count > 0) {
            avgPosX /= count
            avgPosY /= count
            const steerX = avgPosX - this.position.x
            const steerY = avgPosY - this.position.y
            const magnitude = Math.sqrt(steerX * steerX + steerY * steerY)
            this.applyForce(steerX / magnitude, steerY / magnitude, this.cohesionFactor)
        }
    }

    applyForce(forceX, forceY, factor) {
        const magnitude = Math.sqrt(forceX * forceX + forceY * forceY)
        if (magnitude > 0) {
            forceX /= magnitude
            forceY /= magnitude
            forceX *= this.maxForce * factor
            forceY *= this.maxForce * factor
            this.acceleration.x += forceX
            this.acceleration.y += forceY
        }
    }

    moveAwayFromSheepdog(sheepdog) {
        const distanceX = this.position.x - sheepdog.position.posX
        const distanceY = this.position.y - sheepdog.position.posY
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)
    
        const fleeX = distanceX / distance
        const fleeY = distanceY / distance
    
        const maxVelocityChange = 0.05
        const scaledFleeX = fleeX * maxVelocityChange
        const scaledFleeY = fleeY * maxVelocityChange
        
        this.velocity.x += scaledFleeX
        this.velocity.y += scaledFleeY
    }
}

class Sheepdog {
    constructor(posX, posY) {
        this.img = dogImg
        this.position = {posX, posY}
        this.maxSpeed = 2
        this.moveX = 0
        this.moveY = 0
        this.direction = Math.PI
    }
    draw(ctx) {
        ctx.save()
        ctx.translate(this.position.posX, this.position.posY)
        ctx.rotate(this.direction)
        ctx.drawImage(this.img, -8, -8, 16, 16)
        ctx.restore()
    }
    handleInput(input) {
        const prevPosX = this.position.posX
        const prevPosY = this.position.posY

        if (input.keys.indexOf("KeyD") > -1 || input.keys.indexOf("right") > -1) {
            this.moveX = 1
            this.frameY = 32
            this.direction = -Math.PI / 2
        } else if (input.keys.indexOf("KeyA") > -1 || input.keys.indexOf("left") > -1) {
            this.moveX = -1
            this.frameY = 64
            this.direction = Math.PI / 2
        } else if (input.keys.indexOf("KeyW") > -1 || input.keys.indexOf("up") > -1) {
            this.moveY = -1
            this.frameY = 96
            this.direction = Math.PI
        } else if (input.keys.indexOf("KeyS") > -1 || input.keys.indexOf("down") > -1) {
            this.moveY = 1
            this.frameY = 0
            this.direction = 0
        } else {
            this.moveX = 0
            this.moveY = 0
        }

        this.position.posX += this.moveX
        this.position.posY += this.moveY

        this.position.posX = Math.max(0, Math.min(gameWidth, this.position.posX))
        this.position.posY = Math.max(0, Math.min(gameHeight, this.position.posY))

        if (this.position.posX !== prevPosX || this.position.posY !== prevPosY) {
            this.moveX = 0
            this.moveY = 0
        }
    }
    moveSheep(sheeps) {
        const influenceRadius = 50
        const maxInfluenceDistance = 100
        const maxInfluenceFactor = 1.1
        const fleeAlignmentFactor = 0.2

        let scaredSheep = null
    
        sheeps.forEach(sheep => {
            const distanceX = sheep.position.x - this.position.posX
            const distanceY = sheep.position.y - this.position.posY
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)
    
            if (distance < influenceRadius) {
                sheep.moveAwayFromSheepdog(this)
    
                sheep.maxSpeed *= maxInfluenceFactor
    
                setTimeout(() => {
                    sheep.maxSpeed /= maxInfluenceFactor
                }, 1000)
    
                if (!scaredSheep || distance < scaredSheep.distanceToDog) {
                    scaredSheep = { sheep, distanceToDog: distance }
                }
            }
        })

        if (scaredSheep) {
            sheeps.forEach(otherSheep => {
                if (otherSheep !== scaredSheep.sheep) {
                    const distanceToScaredSheep = Math.sqrt(
                        (otherSheep.position.x - scaredSheep.sheep.position.x) ** 2 +
                        (otherSheep.position.y - scaredSheep.sheep.position.y) ** 2
                    )
                    if (distanceToScaredSheep < maxInfluenceDistance) {
                        const influenceFactor = 1 - distanceToScaredSheep / maxInfluenceDistance
                        otherSheep.alignmentFactor = fleeAlignmentFactor * influenceFactor
                    }
                }
            })
        }
    }
}

class InputHandler {
    constructor() {
        this.keys = []
        window.addEventListener("keydown", (e) => {
            if ((e.code == "KeyW" ||
                 e.code == "KeyD" ||
                 e.code == "KeyS" ||
                 e.code == "KeyA" )
                 && this.keys.indexOf(e.code) === -1) {
                    this.keys.push(e.code)
                 }
        })
        window.addEventListener("keyup", (e) => {
            if (e.code == "KeyW" ||
                e.code == "KeyD" ||
                e.code == "KeyS" ||
                e.code == "KeyA" ) {
                this.keys.splice(this.keys.indexOf(e.code), 1)
                }
        })
    }
}

const handleDisplay = () => {
    let updateDisplay = setInterval(() => {
        time++
        document.getElementById("timer").innerHTML = time
        if (gameOver) clearInterval(updateDisplay)
    }, 1000)
}

const startGame = () => {
    flock = new Flock(8)
    dog = new Sheepdog(160, 300)
    pen = new Pen(128, 0)
    handleDisplay()
    runGame()
}

const endGame = () => {
    document.getElementById("game-over").style.display = "block"
    document.getElementById("result").innerHTML = time
}

const input = new InputHandler()

const runGame = () => {
    ctx.clearRect(0, 0, gameWidth, gameHeight)
    pen.draw(ctx)
    pen.penSheep(flock.sheeps)
    flock.update()
    flock.draw(ctx)
    dog.moveSheep(flock.sheeps)
    dog.handleInput(input)
    dog.draw(ctx)
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