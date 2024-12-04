window.addEventListener("load", () => {
    const startBtn = document.getElementById("start")
    const resetBtn = document.getElementById("reset")
    const monsters = document.getElementById("monsters")

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    // Images
    const bgImg = new Image()
    bgImg.src = "../assets/images/monster/maptwo.png"
    const battleBgImg = new Image()
    battleBgImg.src = "../assets/images/monster/battlebg.png"
    const houseImg = new Image()
    houseImg.src = "../assets/images/monster/housetwo.png"
    const labImg = new Image()
    labImg.src = "../assets/images/monster/labtwo.png"
    const waterImg = new Image()
    waterImg.src = "../assets/images/monster/watertwo.png"
    const postImg = new Image()
    postImg.src = "../assets/images/monster/posttwo.png"
    const wallImg = new Image()
    wallImg.src = "../assets/images/monster/bigposttwo.png"
    const signImg = new Image()
    signImg.src = "../assets/images/monster/signtwo.png"
    const grassImg = new Image()
    grassImg.src = "../assets/images/monster/grasssheet.png"
    const playerImg = new Image()
    playerImg.src = "../assets/images/monster/trainer.png"
    const playerBtlImg = new Image()
    playerBtlImg.src = "../assets/images/monster/playerbtl.png"
    const pokecubeImg = new Image()
    pokecubeImg.src = "../assets/images/monster/pokecube.png"
    const snartleImg = new Image()
    snartleImg.src = "../assets/images/monster/fakesquirtle_sprite.png"
    const funguyImg = new Image()
    funguyImg.src = "../assets/images/monster/funguy.png"
    const cayenndarImg = new Image()
    cayenndarImg.src = "../assets/images/monster/cayenndar.png"


    const pokemons = [
        {
            "name": "Snartle",
            "img": snartleImg
        },
        {
            "name": "Cayenndar",
            "img": cayenndarImg
        },
        {
            "name": "funguy",
            "img": funguyImg
        }
    ]


    const gameWidth = 320
    const gameHeight = 288
    const tileSize = 16
    const obstacleArray = []
    const grassArray = []
    const optionArray = []
    let battle = false
    let throwing = false
    let pauseAction = false
    let lastTime = 0
    let optionIndex = 0
    let wildPokemon = {}
    let pokecube = {}
    let team = []

    // Map
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

    // Objects that don't move
    class StaticObject{
        constructor(objImage, posX, posY, objWidth, objHeight) {
            this.img = objImage
            this.x = posX
            this.y = posY
            this.width = objWidth
            this.height = objHeight
        }
        draw(context) {
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
    }

    class Grass {
        constructor(posX, posY) {
            this.img = grassImg
            this.x = posX
            this.y = posY
            this.width = tileSize
            this.height = tileSize
            this.moving = false
            this.frameX = 0
            this.frameY = 0
            this.frameCount = 1
            this.fps = 6
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
        }
        draw(context) {
            context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(deltaTime) {
            if (this.x < player.x + player.width &&
                this.x + this.width > player.x &&
                this.y < player.y + player.height &&
                this.y + this.height > player.y) {
                this.moving = true
            } else {
                this.moving = false
            }
            if (this.moving) {
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
            } else {
                this.frameX = 0
            }
        }
        triggerBattle() {
            if (this.moving) {
                let battleChance = Math.floor(Math.random() * 2000)
                if (battleChance == 1 && !battle && !throwing) {
                    battle = true
                    battleScene()
                }
            }
        }
    }

    class Message {
        constructor(lineOne) {
            this.lineOne = lineOne
        }
        draw(ctx) {
            ctx.font = "20px sans-serif"
            ctx.fillStyle = "#081820"
            ctx.fillText(this.lineOne, 32, 228)
        }
    }

    class Option {
        constructor(text, posX, posY, func, pokemon) {
            this.optionText = text
            this.x = posX
            this.y = posY
            this.executeFunc = func
            this.selected = false
            this.pokemon = pokemon
        }
        draw(ctx) {
            ctx.font = "20px sans-serif"
            ctx.fillStyle = "#081820"
            ctx.fillText(this.optionText, this.x, this.y)
            if (this.selected) {
                ctx.beginPath();
                ctx.moveTo(32, this.y);
                ctx.lineTo(128, this.y);
                ctx.stroke();
            }
        }
        select() {
            if (this.selected) {
                if (this.executeFunc == "throwball") {
                    throwing = true
                    throwBall(this.pokemon)
                    optionArray.length = 0
                } else if (this.executeFunc == "runaway") {
                    optionArray.length = 0
                    displayMessage.lineOne = "Git gud, chump!"
                    setTimeout(() => {
                        displayMessage.lineOne = "You ran like a coward!"
                    }, 1500)
                    setTimeout(() => {
                        battle = false
                        return firstScene()
                    }, 3000)
                }
            } 
        }
    }

    class Player{
        constructor() {
            this.width = tileSize
            this.height = tileSize
            this.x = 80
            this.y = 96
            this.img = playerImg
            this.frameX = 0
            this.frameY = 0
            this.frameCount = 3
            this.fps = 6
            this.frameTimer = 0
            this.frameInterval = 1000/this.fps
            this.moveX = 0
            this.moveY = 0
            this.movingUp = false
            this.movingDown = false
            this.movingLeft = false
            this.movingRight = false
            this.moving = false
        }
        draw(context, deltaTime) {
            context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.frameCount) {
                    this.frameX = 0
                } else {
                    this.frameX++
                }
                this.frameTimer = 0
            } else {
                if (this.moving) {
                    this.frameTimer += deltaTime
                } else {
                    this.frameX = 0
                }
            }
        }
        update(input) {
            this.x += this.moveX
            this.y += this.moveY
            if (input.keys.indexOf("KeyD") > -1) {
                if (this.movingRight && obstacleArray.some(checkCollisions)) {
                    this.moveX = 0
                    this.moving = false
                } else {
                this.frameY = 48
                this.moveX = 1
                this.moveY = 0
                this.moving = true
                this.movingRight = true
                this.movingUp = false
                this.movingLeft = false
                this.movingDown = false            
                }
            } else if (input.keys.indexOf("KeyA") > -1) {
                if (this.movingLeft && obstacleArray.some(checkCollisions)) {
                    this.moveX = 0
                } else {
                this.frameY = 32
                this.moveX = -1
                this.moveY = 0
                this.moving = true
                this.movingRight = false
                this.movingUp = false
                this.movingLeft = true
                this.movingDown = false 
                }
            } else if (input.keys.indexOf("KeyW") > -1) {
                if (this.movingUp && obstacleArray.some(checkCollisions)) {
                    this.moveY = 0
                } else {
                this.frameY = 16
                this.moveY = -1
                this.moveX = 0
                this.moving = true
                this.movingRight = false
                this.movingUp = true
                this.movingLeft = false
                this.movingDown = false 
                }
            } else if (input.keys.indexOf("KeyS") > -1) {
                if (this.movingDown && obstacleArray.some(checkCollisions)) {
                    this.moveY = 0
                } else {
                this.frameY = 0
                this.moveY = 1
                this.moveX = 0
                this.moving = true
                this.movingRight = false
                this.movingUp = false
                this.movingLeft = false
                this.movingDown = true
                } 
            } else {
                this.moveX = 0
                this.moveY = 0
                this.moving = false
            }
        }
    }

    class Pokecube {
        constructor(pokemon) {
            this.img = pokecubeImg
            this.x = gameWidth / 2
            this.y = gameHeight / 2
            this.moveX = 2
            this.moveY = -2
            this.width = tileSize
            this.height = tileSize
            this.stop = false
            this.pokemon = pokemon
        }
        draw(ctx) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
        update() {
            if (!this.stop) {
                this.x += this.moveX
                this.y += this.moveY
                if (this.x >= gameWidth - 32) {
                    this.moveX = -2
                } else if (this.x < 16) {
                    this.moveX = 2
                }
                if (this.y >= gameHeight - 110) {
                    this.moveY = -2
                } else if (this.y < 16) {
                    this.moveY = 2
                }                
            }
        }
        throw() {
            if (this.x < wildPokemon.x + wildPokemon.width &&
                this.x + this.width > wildPokemon.width &&
                this.y < wildPokemon.y + wildPokemon.height &&
                this.y + this.height > wildPokemon.y) {
                    displayMessage.lineOne = "You caught it!"
                    pauseAction = true
                    team.push(this.pokemon)
                } else {
                    displayMessage.lineOne = "You missed, ya chump!"
                }
                this.stop = true
                endBattle()
        }
    }

    const checkCollisions = (obstacle) => {
        if (obstacle.img == houseImg || obstacle.img == labImg) {
            if (player.x < obstacle.x + obstacle.width && 
                player.x + player.width > obstacle.x && 
                player.y < obstacle.y + obstacle.height - 2 && 
                player.y + player.height > obstacle.y + tileSize) {
                return true
            } else {
                return false
            }
        } else {
            if (player.x < obstacle.x + obstacle.width - 2 && 
                player.x + player.width > obstacle.x - 2 && 
                player.y < obstacle.y + obstacle.height - 2 && 
                player.y + player.height > obstacle.y + 4) {
                return true
            } else {
                return false
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
                     e.code == "KeyA")
                     && this.keys.indexOf(e.code) === -1) {
                        this.keys.push(e.code)
                     }
            })
            window.addEventListener("keyup", (e) => {
                if (e.code == "KeyW" ||
                    e.code == "KeyD" ||
                    e.code == "KeyS" ||
                    e.code == "KeyA") {
                    this.keys.splice(this.keys.indexOf(e.code), 1)
                    }
            })      
        }
    }

    const handleSelectMenu = (e) => {
        if (e.code === "KeyS" && battle && !throwing) {
            optionIndex++
            if (optionIndex > optionArray.length - 1) {
                optionIndex = 0
            }
        } else if (e.code === "KeyD" && battle && !throwing) {
            optionIndex--
            if (optionIndex < 0) {
                optionIndex = optionArray.length - 1
            }
        }
        for (let option in optionArray) {
            if (option == optionIndex) {
                optionArray[option].selected = true
            } else {
                optionArray[option].selected = false
            }
        }
        if (e.code === "KeyE" && !throwing) {
            if (optionArray[optionIndex].selected) {
                optionArray[optionIndex].select()                
            }
        }
        if (e.code == "Space" && throwing) {
            pokecube.throw()
        }
    }


    const firstScene = () => {
        background.img = bgImg
        obstacleArray.length = 0
        grassArray.length = 0
        const firstHouse = new StaticObject(houseImg, 64, 48, 64, 48)
        obstacleArray.push(firstHouse)
        const secondHouse = new StaticObject(houseImg, 192, 48, 64, 48)
        obstacleArray.push(secondHouse)
        const lab = new StaticObject(labImg, 160, 128, 96, 64)
        obstacleArray.push(lab)
        const water = new StaticObject(waterImg, 64, 224, 64, 64)
        obstacleArray.push(water)
        const firstSign = new StaticObject(signImg, 48, 80, tileSize, tileSize)
        obstacleArray.push(firstSign)
        const secondSign = new StaticObject(signImg, 176, 80, tileSize, tileSize)
        obstacleArray.push(secondSign)
        const thirdSign = new StaticObject(signImg, 112, 144, tileSize, tileSize)
        obstacleArray.push(thirdSign)
        const fourthSign = new StaticObject(signImg, 208, 208, tileSize, tileSize)
        obstacleArray.push(fourthSign)
        for (let i = 0; i < 3; i++) {
            const post = new StaticObject(postImg, 64 + (16 * i), 144, tileSize, tileSize)
            obstacleArray.push(post)
            const otherPost = new StaticObject(postImg, 160 + (16 * i), 208, tileSize, tileSize)
            obstacleArray.push(otherPost)
        }
        const onePost = new StaticObject(postImg, 224, 208, tileSize, tileSize)
        obstacleArray.push(onePost)
        const secondPost = new StaticObject(postImg, 240, 208, tileSize, tileSize)
        obstacleArray.push(secondPost)
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const grass = new Grass(160 + (j * 16), 0 + (i * 16))
                grassArray.push(grass)
            }
        }
        for (let i = 0; i < 17; i++) {
            const wall = new StaticObject(wallImg, 0, 16 + (16 * i), tileSize, tileSize)
            obstacleArray.push(wall)
            const otherWall = new StaticObject(wallImg, 304, 16 + (16 * i), tileSize, tileSize)
            obstacleArray.push(otherWall)
        }
        for (let i = 0; i < 9; i++) {
            const wall = new StaticObject(wallImg, 16 + (16 * i), 16, tileSize, tileSize)
            obstacleArray.push(wall)
        }
        for (let i = 0; i < 7; i++) {
            const wall = new StaticObject(wallImg, 192 + (16 * i), 16, tileSize, tileSize)
            obstacleArray.push(wall)
        }
        for (let i = 0; i < 3; i++) {
            const wall = new StaticObject(wallImg, 16 + (16 * i), 272, tileSize, tileSize)
            obstacleArray.push(wall)
        }
        for (let i = 0; i < 11; i++) {
            const wall = new StaticObject(wallImg, 128 + (16 * i), 272, tileSize, tileSize)
            obstacleArray.push(wall)
        }
    }

    const battleScene = () => {
        window.addEventListener("keydown", handleSelectMenu)
        background.img = battleBgImg
        obstacleArray.length = 0
        grassArray.length = 0
        const playerBattle = new StaticObject(playerBtlImg, 32, 80, 100, 100)
        obstacleArray.push(playerBattle)
        let randomPokemon = pokemons[Math.floor(Math.random() * pokemons.length)]
        wildPokemon = new StaticObject(randomPokemon["img"], 172, 32, 100, 100)
        displayMessage.lineOne = `A wild ${randomPokemon["name"]} appeared!`
        const firstOption = new Option("Catch", 32, 250, "throwball", randomPokemon["name"])
        optionArray.push(firstOption)
        const secondOption = new Option("Run Away", 32, 270, "runaway")
        optionArray.push(secondOption)
    }

    const throwBall = (pokemon) => {
        battle = false
        obstacleArray.length = 0
        wildPokemon.x = 100
        wildPokemon.y = 32
        pokecube = new Pokecube(pokemon)
        displayMessage.lineOne = "Press Space to throw the ball"
    }

    const endBattle = () => {
        display()
        setTimeout(() => {
            battle = false
            throwing = false
            pauseAction = false
            pokecube = {}
            wildPokemon = {}
            firstScene()
        }, 1500)
    }

    const handleOptions = (ctx) => {
        optionArray.forEach(option => option.draw(ctx))
    }

    const handleObjects = (ctx) => {
        obstacleArray.forEach(object => object.draw(ctx))
    }

    const handleGrass = (ctx, deltaTime) => {
        grassArray.forEach(grass => {
            grass.draw(ctx)
            grass.update(deltaTime)
            grass.triggerBattle()
        })
    }

    const startGame = () => {
        startBtn.removeEventListener("click", startGame)
        startBtn.blur()
        canvas.focus()
        firstScene()
        return runGame()
    }

    const background = new Background()
    const player = new Player()
    const input = new InputHandler()
    const displayMessage = new Message()

    const display = () => {
        let teamList = ""
        for (let monster of team) {
            teamList += monster + ", "                
        }
        monsters.innerHTML = teamList
    }

    function runGame(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        handleGrass(ctx, deltaTime)
        if (!battle && !throwing) {
            player.draw(ctx, deltaTime)
            player.update(input)            
        }
        if (battle && !throwing) {
            displayMessage.draw(ctx)
            handleOptions(ctx)
            wildPokemon.draw(ctx)
        }
        handleObjects(ctx)
        if (throwing) {
            displayMessage.draw(ctx)
            if (!pauseAction) {
                wildPokemon.draw(ctx)
            }
            pokecube.draw(ctx)
            pokecube.update()     
        }        
        requestAnimationFrame(runGame)
    }

    startBtn.addEventListener("click", startGame)
    resetBtn.addEventListener("click", () => {
        location.reload()
    })
})