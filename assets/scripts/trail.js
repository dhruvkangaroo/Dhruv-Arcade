window.addEventListener("load", () => {
    const startBtn = document.getElementById("start")
    const resetBtn = document.getElementById("reset")

    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    // Window Displays
    const dayDisplay = document.getElementById("day-display")
    const weatherDisplay = document.getElementById("weather-display")
    const foodDisplay = document.getElementById("food-display")
    const waterDisplay = document.getElementById("water-display")
    const paceDisplay = document.getElementById("pace-display")
    const moodDisplay = document.getElementById("mood-display")

    // Window Controls
    const checkInvBtn = document.getElementById("check-inventory")
    const scavengeBtn = document.getElementById("scavenge")
    const restBtn = document.getElementById("rest")
    const statBtn = document.getElementById("status")
    const paceSlowBtn = document.getElementById("pace-slow")
    const paceNormBtn = document.getElementById("pace-normal")
    const paceFastBtn = document.getElementById("pace-fast")

    // Game Pop Ups
    const createCharPop = document.getElementById("char-pop-up")
    const enterChars = document.getElementById("enter-chars")
    const gamePopUp = document.getElementById("game-pop-up")
    const restMenu = document.getElementById("rest-pop-up")
    const gamePopText = document.getElementById("game-text")
    const gameChoices = document.getElementById("game-choices")
    const closePopBtn = document.getElementById("close-game-pop-up")
    const closeRestBtn = document.getElementById("rest-options")

    // Game Imgs
    const roadImg = new Image()
    roadImg.src = "../assets/images/trail/road.png"
    const bgSkyImg = new Image()
    bgSkyImg.src = "../assets/images/trail/backgroundsky.png"
    const rainImg = new Image()
    rainImg.src = "../assets/images/trail/rain.png"
    const charOneImg = new Image()
    charOneImg.src = "../assets/images/trail/charonecomp.png"
    const charTwoImg = new Image()
    charTwoImg.src = "../assets/images/trail/chartwocomp.png"
    const charThreeImg = new Image()
    charThreeImg.src = "../assets/images/trail/charthreecomp.png"
    const treeImg = new Image()
    treeImg.src = "../assets/images/trail/trees.png"
    const buildingImg = new Image()
    buildingImg.src = "../assets/images/trail/buildings.png"
    const peopleImg = new Image()
    peopleImg.src = "../assets/images/trail/people.png"
    const dogImg = new Image()
    dogImg.src = "../assets/images/trail/dog.png"
    const catImg = new Image()
    catImg.src = "../assets/images/trail/cat.png"

    // Game variables
    const gameWidth = 512
    const gameHeight = 218
    let lastTime = 0
    let dayTimer = 0
    let dayCounter = 0
    let kmsToGo = 1000
    let treeFgTimer = 0
    let treeBgTimer = 0
    let treeFgInterval = 6000
    let treeBgInterval = 4000
    let randTreeInterval = Math.random() * 2000 + 2500

    let bgTrees = []
    let fgTrees = []
    let alreadySpawned = []
    let spawnedPeople = []
    let spawnedBuildings = []
    let spawnedAnimals = []
    let hasCat = false
    let hasDog = false
    let cat
    let dog
    let obstacleName

    // How to manage inventory???
    let inventory = []
    let pickUps = ['medkit', 'hatchet', 'knife', 'map', 'blanket']

    // Game Stats
    let gameStats = {
        kph: 3,
        pace: 2,
        food: 10,
        water: 10,
        weather: 'Fine',
        gameOver: false,
        gamePaused: false,
    }

    // Array of characters (should be 3 max)
    let gameChars = []

    const characterImages = [charOneImg, charTwoImg, charThreeImg]

    // Characters
    class Character {
        constructor(charName, charSheet, spawnX, spawnY) {
            this.name = charName
            this.img = charSheet
            this.health = 10
            this.food = 10
            this.water = 10
            this.rest = 10
            this.mood = 10
            this.injury = []
            this.alive = true
            this.width = 32
            this.height = 64
            this.x = spawnX
            this.y = spawnY
            this.frameX = 0
            this.frameY = 0
            this.frameCount = 5
            this.frameTimer = 0
            this.fps = 3
            this.frameInterval = 1000/this.fps
            this.status = []
        }
        draw(context) {
            if (this.alive){
                context.drawImage(this.img, this.frameX * this.width, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height)
            }
        }
        update(deltaTime) {
            // Update frames
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.frameCount) {
                    this.frameX = 0
                } else {
                    this.frameX++
                }
                this.frameTimer = 0
            } else {
                this.frameTimer += deltaTime * gameStats.pace
            }
            if (gameStats.weather == 'Fine') {
                if (this.mood < 5 || this.health < 5) {
                    this.frameY = 64
                } else {
                    this.frameY = 0
                }
            } else if (gameStats.weather != 'Fine') {
                this.frameY = 128
            }
        }
        updateHealth() {
            if (!gameStats.gamePaused) {
                // Check health against other stats for each character
                // Decrease stats
                this.food -= 1
                this.water -= 1
                this.rest -= 1
                // Cap stats
                if (this.food > 10) {
                    this.food = 10
                }
                if (this.water > 10) {
                    this.water = 10
                }
                if (this.rest > 10) {
                    this.rest = 10
                }
                if (this.health > 10) {
                    this.health = 10
                }
                // Reduce health when other stats below threshold (or increase if food above)
                // Cap health loss so can only die if no water, then if runs out of water, dies
                if (this.food < 7 && this.health >= 2) {
                    this.health -= 1
                } else {
                    this.health += 1
                }
                if (this.water < 7) {
                    this.health -= 1
                }
                if (this.rest < 7 && this.health >= 2) {
                    this.health -= 1
                }
                // If out of food, worsen thirst
                if (this.food <= 0) {
                    this.water -= 1
                }
                // If thirst or health at zero, die
                if (this.water <= 0 || this.health <= 0 ) {
                    this.alive = false
                }
            }
        }
        updateMood() {
            if (!gameStats.gamePaused) {
                // Check mood against other stats for each character
                if (this.food < 7 || this.water < 7 || this.rest < 7) {
                    this.mood -= 1
                }
                if (this.food >= 7 && this.water >= 7 && this.rest >= 5) {
                    this.mood += 1
                }
                if (this.mood > 10) {
                    this.mood = 10
                }
                if (this.health < 5 && this.mood > 5) {
                    // Prevent mood going above 5 when health is low
                    this.mood = 4
                }
                if (this.food <= 5 && !this.status.includes("Hungry")) {
                    this.status.push("Hungry")
                } else if (this.food > 5 && this.status.includes("Hungry")) {
                    this.status = this.status.filter(stat => stat != "Hungry")
                }
                if (this.water <= 5 && !this.status.includes("Thirsty")) {
                    this.status.push("Thirsty")
                } else if (this.water > 5 && this.status.includes("Thirsty")) {
                    this.status = this.status.filter(stat => stat != "Thirsty")
                }
                if (this.rest <= 5 && !this.status.includes("Tired")) {
                    this.status.push("Tired")
                } else if (this.rest > 5 && this.status.includes("Tired")) {
                    this.status = this.status.filter(stat => stat != "Tired")
                }
                // If has animal companion
                if (hasCat || hasDog) {
                    if (this.mood < 10) {
                        this.mood += 1
                    }
                }
            }
        }
    }

    // Create character function to be called at start - add event listeners for options
    enterChars.addEventListener("click", createCharacters)

    function createCharacters() {
        const characters = document.getElementsByName('characters')
        let names = []
        let posX = 150
        let posY = 42
        for (let i = 0; i < characters.length; i++) {
            if (characters[i].value !== ''){
                names.push(characters[i].value)
            }
        }
        if (!names.length) {
            // If no characters entered
            gamePopUp.style.display="block"
            gamePopText.innerHTML = "<h2>Enjoy the scenery...</h2>"
        } else {
            for (let i = 0; i < names.length; i++) {
                let spawnX = posX += 32
                let spawnY = posY += 32
                gameChars.push(new Character(names[i], characterImages[i], spawnX, spawnY))
            }            
        }
        startBtn.removeEventListener("click", runGame)
        closePopBtn.addEventListener("click", closePopUpBtn)
        checkInvBtn.addEventListener("click", openInventory)
        scavengeBtn.addEventListener("click", openScavenge)
        restBtn.addEventListener("click", openRestMenu)
        statBtn.addEventListener("click", openStats)
        paceSlowBtn.addEventListener("click", handlePace)
        paceNormBtn.addEventListener("click", handlePace)
        paceFastBtn.addEventListener("click", handlePace)
        dayTimer = 0
        treeBgTimer = 0
        treeFgTimer = 0
        gameStats.pace = 2
        createCharPop.style.display = "none"
        foodDisplay.innerHTML = gameStats.food
        waterDisplay.innerHTML = gameStats.water
        enterChars.removeEventListener("click", createCharacters)
    }

    // Handle Characters - for now, just draw, but need to manage health, mood, food, etc
    function handleCharacters(ctx, deltaTime) {
        gameChars.forEach(char => {
            char.draw(ctx)
            char.update(deltaTime)
        })
        // Update health stuff
        if (dayTimer % 2000 == 0) {
            gameChars.forEach(char => {
                char.updateHealth()
                char.updateMood()
        })
        }
        // Checking mood of group
        let moodAvg = gameChars.map(char => char.mood).reduce((acc, val) => {return acc + val}, 0)
        if (moodAvg / gameChars.length >= 7) {
            moodDisplay.innerHTML = "Good"
        } else if (moodAvg / gameChars.length > 3 && moodAvg / gameChars.length < 7 ) {
            moodDisplay.innerHTML = "Okay"
        } else {
            moodDisplay.innerHTML = "Poor"
            gameStats.pace = 1
        }
        // Remove dead characters...
        gameChars = gameChars.filter(char => char.alive)
    }

    // Background
    class Background {
        constructor() {
            this.img = bgSkyImg
            this.x = 0
            this.y = 0
            this.width = gameWidth
            this.height = gameHeight
            this.speed = 0.5
        }
        draw(context) {
            // Draw img twice for endless scrolling
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
            context.drawImage(this.img, this.x + this.width - this.speed, this.y, this.width, this.height)
        }
        update() {
            this.x -= this.speed * gameStats.pace
            // Reset img when scrolled off screen
            if (this.x < 0 - this.width) {
                this.x = this.x - (0 - this.width)
            }
        }
    }

    class Tree {
        constructor(spawnY, spawnSpeed, spawnFrame) {
            this.img = treeImg
            this.gameWidth = gameWidth
            this.x = this.gameWidth
            this.y = spawnY
            this.width = 32
            this.height = 192
            this.frameX = spawnFrame
            this.speed = spawnSpeed
            this.markedForDeletion = false
        }
        draw(context) {
            context.drawImage(this.img, this.frameX, 0, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update() {
            this.x -= this.speed * gameStats.pace
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true
            }
        }
    }

    // Handle trees
    function handleBgTrees(deltaTime) {
        if (treeBgTimer > treeBgInterval + randTreeInterval) {
            let frameX = (Math.floor(Math.random() * 6)) * 32
            bgTrees.push(new Tree(0, 0.4, frameX))
            randTreeInterval = Math.random() * 2000 + 2500
            treeBgTimer = 0
        } else {
            treeBgTimer += deltaTime
        }
        bgTrees.forEach(tree => {
            tree.draw(ctx)
            tree.update()
        })
        bgTrees = bgTrees.filter(tree => !tree.markedForDeletion)        
    }

    function handleFgTrees(deltaTime) {
        if (treeFgTimer > treeFgInterval + randTreeInterval) {
            let frameX = (Math.floor(Math.random() * 6)) * 32
            fgTrees.push(new Tree(96, 0.6, frameX))
            randTreeInterval = Math.random() * 2000 + 2500
            treeFgTimer = 0
        } else {
            treeFgTimer += deltaTime
        }
        fgTrees.forEach(tree => {
            tree.draw(ctx)
            tree.update()
        })
        fgTrees = fgTrees.filter(tree => !tree.markedForDeletion)        
    }

    // Handle rain
    class Sky {
        constructor() {
            this.img = rainImg
            this.x = 0
            this.y = 0
            this.width = gameWidth
            this.height = gameHeight
            this.speed = 1
        }
        draw(context) {
            // Draw img FOUR times for endless scrolling
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
            context.drawImage(this.img, this.x + this.width, this.y, this.width, this.height)
            context.drawImage(this.img, this.x, this.y - this.height, this.width, this.height)
            context.drawImage(this.img, this.x + this.width, this.y - this.height, this.width, this.height)
        }
        update() {
            this.y += this.speed
            this.x -= this.speed
            // Reset img when scrolled off screen - this jerk is going to drive me insane
            if (this.y > 207) {
                this.x = 0
                this.y = 0
            }
        }
    }

    // Handle ground
    class Ground {
        constructor() {
            this.img = roadImg
            this.x = 0
            this.y = 0
            this.width = gameWidth
            this.height = gameHeight
            this.speed = 0.5
        }
        draw(context) {
            // Draw img twice for endless scrolling
            context.drawImage(this.img, this.x, this.y, this.width, this.height)
            context.drawImage(this.img, this.x + this.width - this.speed, this.y, this.width, this.height)
        }
        update() {
            this.x -= this.speed * gameStats.pace
            // Reset img when scrolled off screen
            if (this.x < 0 - this.width) {
                this.x = this.x - (0 - this.width)
            }
        }
    }

    // Obstacles
    class Obstacle {
        constructor(obsType, obsName, obsImg, spawnY, obsWidth, obsHeight, obsY, spawnSpeed) {
            this.type = obsType
            this.name = obsName
            this.img = obsImg
            this.x = gameWidth
            this.y = spawnY
            this.width = obsWidth
            this.height = obsHeight
            this.frameY = obsY
            this.speed = spawnSpeed
            this.markedForDeletion = false
        }
        draw(context) {
            if (!this.markedForDeletion) {
               context.drawImage(this.img, 0, this.frameY, this.width, this.height, this.x, this.y, this.width, this.height) 
            }
        }
        update() {
            this.x -= this.speed * gameStats.pace
            // Quasi-collision detection? Better to check when adjacent to characters?
            if (this.x < 300) {
                obstacleEvents(this.type, this.name)
                this.markedForDeletion = true
            }
            // Delete when off screen
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true
            }
        }
    }

    // Handle obstacle spawning
    function spawnObstacles() {
        let peopleObs = [{name: 'women', y: 0}, {name: 'old lady', y: 96}, {name: 'cowboy', y: 192}]
        let buildingObs = [{name: 'cabin', y: 0}, {name: 'garage', y: 96}, {name: 'shop', y: 192}, {name: 'house', y: 288}, {name: 'tent', y: 384}]
        let animalObs = [{name: 'dog', width: 64, img: dogImg}, {name: 'cat', width: 32, img: catImg}]
        let randNum = Math.floor(Math.random() * 20)
        if (randNum < 10) {
            // No obstacle
            return 
        } else {
            // Pick an obstacle to spawn
            if (randNum >= 10 && randNum < 15) {
                // Spawn a random building
                let building = buildingObs[Math.floor(Math.random() * buildingObs.length)]
                // Check if already spawned - use some instead of includes as object
                if (alreadySpawned.some(obj => obj.name == building.name)) {
                    return spawnObstacles()
                } else {
                    // Push to spawned array 
                    alreadySpawned.push(building)
                    spawnedBuildings.push(new Obstacle('building', building.name, buildingImg, 18, 128, 96, building.y, 0.4))
                }
            } else if (randNum >= 15 && randNum < 18) {
                let person = peopleObs[Math.floor(Math.random() * peopleObs.length)]
                if (alreadySpawned.some(obj => obj.name == person.name)) {
                    return spawnObstacles()
                } else {
                    alreadySpawned.push(person)
                    spawnedPeople.push(new Obstacle('person', person.name, peopleImg, 96, 64, 96, person.y, 0.5))
                }
            } else {
                let animal = animalObs[Math.floor(Math.random() * animalObs.length)]
                if (alreadySpawned.some(obj => obj.name == animal.name)) {
                    return spawnObstacles()
                } else {
                    alreadySpawned.push(animal)
                    spawnedAnimals.push(new Obstacle('animal', animal.name, animal.img, 128, animal.width, 32, 32, 0.5))
                }
            }
        }
    }
    
    // Handle background buildings
    function handleBuildings() {
        spawnedBuildings.forEach(building => {
            building.draw(ctx)
            building.update()
        })
        spawnedBuildings = spawnedBuildings.filter(building => !building.markedForDeletion)
    }

    function handlePeople() {
        spawnedPeople.forEach(person => {
            person.draw(ctx)
            person.update()
        })
        spawnedPeople = spawnedPeople.filter(person => !person.markedForDeletion)
    }

    function handleAnimals() {
        spawnedAnimals.forEach(animal => {
            animal.draw(ctx)
            animal.update()
        })
        spawnedAnimals = spawnedAnimals.filter(animal => !animal.markedForDeletion)
    }

    function approachEvent(e) {
        gameChoices.removeEventListener("click", approachEvent)
        if (e.target && e.target.id == "approach") {
            gameChoices.innerHTML = ""
            gamePopText.innerHTML = ""
            approachBuilding(obstacleName)
        }       
    }

    function tradeWater(e) {
        gameChoices.removeEventListener("click", tradeWater)
        if (e.target && e.target.id == "trade") {
            gameChoices.innerHTML = ""
            gamePopText.innerHTML = ""
            trade("water")
        }    
    }

    function tradeFood(e) {
        gameChoices.removeEventListener("click", tradeFood)
        if (e.target && e.target.id == "trade") {
            gameChoices.innerHTML = ""
            gamePopText.innerHTML = ""
            trade("food")
        }
    }

    function giveSupplies(e) {
        gameChoices.removeEventListener("click", giveSupplies)
        if (e.target && e.target.id == "help-stranger") {
            gameChoices.innerHTML = ""
            gamePopText.innerHTML = ""
            helpStranger(obstacleName)
        }
    }

    function feedAnimal(e) {
        gameChoices.removeEventListener("click", feedAnimal)
        if (e.target && e.target.id == "get-animal") {
            gameChoices.innerHTML = ""
            gamePopText.innerHTML = ""
            getAnimal(obstacleName)
        }
    }

    // Obstacle events
    function obstacleEvents(obsType, obsName) {
        // First want to check what type of obstacle - building, people, animal
        // Then trigger the pop up with relevant text
        obstacleName = obsName
        gameStats.gamePaused = true
        gamePopUp.style.display="block"
        gamePopText.insertAdjacentHTML("afterbegin", `
        <p>You stop before the ${obsName}</p>`)
        switch (obsType) {
            case "building":
                gamePopText.insertAdjacentHTML("beforeend", `
                <p>There doesn't seem to be anyone around.</p>
                <p>It could be a good place to recover a bit.</p>
                <p>Approach the ${obsName}?</p>
                `)
                gameChoices.insertAdjacentHTML("afterbegin", `
                <button id="approach">Approach ${obsName}</button>`)
                gameChoices.addEventListener("click", approachEvent)
                closePopBtn.innerHTML = "Avoid"
                break;
            case "person":
                let randEvent = Math.floor(Math.random * 3)
                let tradeItem
                if (randEvent == 0) {
                    gamePopText.insertAdjacentHTML("beforeend", `
                    <p>They are standing in the middle of the road.</p>
                    <p>They say they have no food but plenty of water and offer a trade.</p>
                    `)
                    gameChoices.insertAdjacentHTML("afterbegin", `
                    <button id="trade">Trade</button>`)
                    gameChoices.addEventListener("click", tradeWater)
                } else if (randEvent == 1) {
                    gamePopText.insertAdjacentHTML("beforeend", `
                    <p>They are standing in the middle of the road.</p>
                    <p>They say they're very thirsty, but can offer food to trade for water.</p>
                    `)
                    gameChoices.insertAdjacentHTML("afterbegin", `
                    <button id="trade">Trade</button>`)
                    gameChoices.addEventListener("click", tradeFood)
                } else {
                    gamePopText.insertAdjacentHTML("beforeend", `
                    <p>They are standing in the middle of the road.</p>
                    <p>They say they have no food or water, and beg for anything you can spare.</p>
                    <p>Give them some food and water?</p>
                    `)
                    gameChoices.insertAdjacentHTML("afterbegin", `
                    <button id="help-stranger">Give Supplies</button>`)
                    gameChoices.addEventListener("click", giveSupplies)
                }
                closePopBtn.innerHTML = "Refuse"
                break;
            case "animal":
                gamePopText.insertAdjacentHTML("beforeend", `
                <p>A ${obsName} is sitting in the middle of the road.</p>
                <p>It looks hungry.</p>
                <p>Give some food to the ${obsName}?</p>
                `)
                gameChoices.insertAdjacentHTML("afterbegin", `
                <button id="get-animal">Feed ${obsName}</button>`)
                gameChoices.addEventListener("click", feedAnimal)
                closePopBtn.innerHTML = "Don't Feed"
                break;
        }
    }

    // Event functions
    function approachBuilding(obsName) {
        // Time will always pass
        if (dayTimer <= 7999) {
            dayTimer += 2000
        } else {
            let time = 10000 - dayTimer
            dayTimer = 0 + time
            dayCounter++
        }
        // Event outcomes
        let randEvent = Math.floor(Math.random() * 8)
        if (randEvent < 7) {
            gameChars.forEach(char => {
                char.food = 10
                char.water = 10
                char.mood = 10
                char.rest = 10
            })
            closePopBtn.innerHTML = "Okay"
            if (randEvent < 4) {
                gamePopText.insertAdjacentHTML("afterbegin", `
                <p>The ${obsName} is quiet and empty, but seems safe.</p>
                <p>After searching the ${obsName}, there are just enough supplies for a good meal.</p>
                <p>The old furniture provides a good rest.</p>
                `)
            } else if (randEvent == 5) {
                gameStats.food += 2
                gameStats.water += 2
                gamePopText.insertAdjacentHTML("afterbegin", `
                <p>The ${obsName} is quiet and empty, but seems safe.</p>
                <p>After searching the ${obsName}, there are enough supplies for a good meal and extra for the road.</p>
                <p>The old furniture provides a good rest.</p>
                `)
            } else {
                gamePopText.insertAdjacentHTML("afterbegin", `
                <p>The ${obsName} is quiet and empty, but seems safe.</p>
                <p>After searching the ${obsName}, there are just enough supplies for a good meal.</p>
                <p>The old furniture provides a good rest.</p>
                <p>Unfortunately, while resting someone steals some of your supplies.</p>
                `)
                if (gameStats.food >= 2) {
                    gameStats.food -= 2
                } else {
                    gameStats.food = 0
                }
                if (gameStats.water >= 2) {
                    gameStats.water -= 2
                } else {
                    gameStats.water = 0
                }
            }
        } else {
            gamePopText.insertAdjacentHTML("afterbegin", `
            <p>While searching the ${obsName}, a family appear from a small room in the back.</p>
            <p>They are scared and hungry, but let you rest if you share some food with them.</p>
            <p>You have ${gameStats.food}kg.</p>
            `)
            gameChoices.insertAdjacentHTML("afterbegin", `
            <button id="share-food">Share food</button>`)
            gameChoices.addEventListener("click", (e) => {
                if (e.target && e.target.id == "share-food") {
                    if (gameStats.food >= 3) {
                        gameStats.food -= 3
                    } else {
                        gameStats.food = 0
                    }
                    gameChars.forEach(char => {
                        char.food = 10
                        char.water = 10
                        char.mood = 10
                        char.rest = 10
                    })
                    gamePopText.innerHTML = `
                    <p>The family are very grateful for your help.</p>
                    <p>After resting, they offer a medkit as thanks.</p>
                    `
                    gameChoices.innerHTML = ""
                    closePopBtn.innerHTML = "Okay"
                    inventory.push("medkit")
                }
            })
            closePopBtn.innerHTML = "Refuse"
        }
    }

    // Handle encounters
    function trade(tradeItem) {
        if (tradeItem == "food") {
            if (gameStats.food >= 2) {
                gameStats.food -= 2
                gamePopText.insertAdjacentHTML("afterbegin", `
                <p>You trade 2kg of food for 2l of water.</p>
                `)
            } else {
                gameStats.food = 0
                gamePopText.insertAdjacentHTML("afterbegin", `
                <p>You trade the remainder of your food for 2l of water.</p>
                `)
            }
            gameStats.water += 2
        } else {
            if (gameStats.water >= 2) {
                gameStats.water -= 2
                gamePopText.insertAdjacentHTML("afterbegin", `
                <p>You trade 2l of water for 2kg of food.</p>
                `)
            } else {
                gameStats.water = 0
                gamePopText.insertAdjacentHTML("afterbegin", `
                <p>You trade the remainder of your water for 2kg of food.</p>
                `)
            }
            gameStats.food += 2            
        }
    }

    function helpStranger(obsName) {
        if (gameStats.food >= 1) {
            gameStats.food -= 1
        } else {
            gameStats.food = 0
        }
        if (gameStats.water >= 1) {
            gameStats.water -= 1
        } else {
            gameStats.water = 0
        }
        gamePopText.innerHTML = `
        <p>The ${obsName} is very grateful.</p>
        <p>The only thing they can offer in return is a medkit.</p>
        `
        inventory.push("medkit")
        closePopBtn.innerHTML = "Okay"
    }

    // Handle Animals
    class Animal {
        constructor(animalImg, animalWidth) {
            this.img = animalImg
            this.x = 186
            this.y = 160
            this.width = animalWidth
            this.height = 32
            this.frameX = 0
            this.frameCount = 5
            this.frameTimer = 0
            this.fps = 3
            this.frameInterval = 1000/this.fps
            this.isCompanion = false
        }
        draw(context) {
            if (this.isCompanion) {
                context.drawImage(this.img, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
            }
        }
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.frameCount) {
                    this.frameX = 0
                } else {
                    this.frameX++
                }
                this.frameTimer  = 0
            } else {
                this.frameTimer += deltaTime * gameStats.pace
            }
        }
    }

    function getAnimal(obsName) {
        console.log("I've been called")
        if (gameStats.food >= 1) {
            gameStats.food -= 1
        } else {
            gameStats.food = 0
        }
        closePopBtn.innerHTML = "Okay"
        if (hasCat) {
            hasCat = false
            hasDog = true
            cat = {}
            dog = new Animal(dogImg, 64)
            dog.isCompanion = true
            gamePopText.innerHTML = `
            <p>The ${obsName} is grateful for the food.</p>
            <p>It decides to follow you.</p>
            <p>The cat hisses and runs away.</p>
            `
        } else if (hasDog) {
            hasDog = false
            hasCat = true
            dog = {}
            cat = new Animal(catImg, 32)
            cat.isCompanion = true
            gamePopText.innerHTML = `
            <p>The ${obsName} is grateful for the food.</p>
            <p>It decides to follow you.</p>
            <p>The dog runs away with its tail between its legs.</p>
            `
        } else {
            if (obsName == "dog") {
                hasDog = true
                dog = new Animal(dogImg, 64)
                dog.isCompanion = true
            } else {
                hasCat = true
                cat = new Animal(catImg, 32)
                cat.isCompanion = true
            }
            gamePopText.innerHTML = `
            <p>The ${obsName} is grateful for the food.</p>
            <p>It decides to follow you.</p>
            `            
        }
    }

    // Handle the day timer
    function manageDays() {
        foodDisplay.innerHTML = gameStats.food
        waterDisplay.innerHTML = gameStats.water
        dayTimer += 1
        // Every 1000, reduce kmsToGo
        if (dayTimer % 1000 === 0) {
            kmsToGo -= (gameStats.kph + gameStats.pace)
        }
        // Add darkness
        if (dayTimer >= 5000) {
            ctx.fillStyle = 'rgba(87, 67, 50, 0.4)'
            ctx.fillRect(0, 0, gameWidth, gameHeight)
        }
        // Update day, also roll for weather
        if (dayTimer >= 10000) {
            let weatherRand = Math.floor(Math.random() * 4)
            dayTimer = 0
            dayCounter += 1
            dayDisplay.innerHTML = dayCounter
            if (weatherRand == 0) {
                gameStats.weather = 'Rain'
            } else {
                gameStats.weather = 'Fine'
            }
            weatherDisplay.innerHTML = gameStats.weather
        }
        // Check for obstacles
        let randTime = Math.floor(Math.random() * 2000) + 1000
        if (dayCounter % 1 == 0 && dayTimer == randTime) {
            spawnObstacles()
        }
    }

    // Handle pace
    function handlePace(e) {
        if (e.target.id == 'pace-slow') {
            gameStats.pace = 1
            paceDisplay.innerHTML = 'Slow'
        } else if (e.target.id == 'pace-normal') {
            gameStats.pace = 2
            paceDisplay.innerHTML = 'Normal'
        } else if (e.target.id == 'pace-fast') {
            gameStats.pace = 3
            paceDisplay.innerHTML = 'Fast'
        }
    }
    
    // Handle rest options
    function openRestMenu() {
        gameStats.gamePaused = true
        restMenu.style.display="block"
        closeRestBtn.addEventListener("click", handleRest)
    }

    function handleRest() {
        gameStats.gamePaused = false
        restMenu.style.display="none"
        closeRestBtn.removeEventListener("click", handleRest)
        let eating = document.querySelector("input[name='eating']:checked").value
        let drinking = document.querySelector("input[name='drinking']:checked").value
        let resting = document.querySelector("input[name='resting']:checked").value

        switch (eating) {
            case "nothing":
                break;
            case "small-meal":
                if (gameStats.food >= gameChars.length) {
                    gameStats.food -= gameChars.length / 2
                    gameChars.forEach((char) => {
                        if (char.food <= 5) {
                            char.food += 5
                        } else {
                            char.food = 10
                        }
                    })
                } else {
                    gameStats.food = 0
                    gameChars.forEach((char) => {
                        if (char.food <= 8) {
                            char.food += 2
                        } else {
                            char.food = 10
                        }
                    })
                    // Should return note about not having enough food??
                }
                break;
            case "large-meal":
                if (gameStats.food >= gameChars.length) {
                    gameStats.food -= gameChars.length
                    
                    gameChars.forEach((char) => {
                        char.food = 10
                        char.mood = 10                        
                    })
                } else {
                    gameStats.food = 0
                    gameChars.forEach((char) => {
                        if (char.food <= 8) {
                            char.food += 2
                        } else {
                            char.food = 10
                        }
                    })
                    // Should return note about not having enough food??
                }
                break;
        }
        switch (drinking) {
            case "nothing":
                break;
            case "small-drink":
                if (gameStats.water >= gameChars.length) {
                    gameStats.water -= gameChars.length / 2
                    gameChars.forEach((char) => {
                        if (char.water <= 7) {
                            char.water += 3
                        } else {
                            char.water = 10
                        }
                    })
                } else {
                    gameStats.water = 0
                    gameChars.forEach((char) => {
                        if (char.water <= 9) {
                            char.water += 1
                        } else {
                            char.water = 10
                        }
                    })
                    // Should return note about not having enough water??
                }
                break;
            case "large-drink":
                if (gameStats.water >= gameChars.length) {
                    gameStats.water -= gameChars.length
                    gameChars.forEach((char) => {
                        if (char.water <= 5) {
                            char.water += 5
                        } else {
                            char.water = 10
                        }
                    })
                } else {
                    gameStats.water = 0
                    gameChars.forEach((char) => {
                        if (char.water <= 9) {
                            char.water += 1
                        } else {
                            char.water = 10
                        }
                    })
                    // Should return note about not having enough water??
                }
                break;
        }
        switch (resting) {
            case "nothing":
                break;
            case "short-sleep":
                gameChars.forEach((char) => {
                    if (char.rest <= 5) {
                        char.rest += 5
                    } else {
                        char.rest = 10
                    }
                })
                if (dayTimer <= 7999) {
                    dayTimer += 2000
                } else {
                    let time = 10000 - dayTimer
                    dayTimer = 0 + time
                    dayCounter++
                }
                break;
            case "long-sleep":
                gameChars.forEach((char) => {
                    if (char.rest <= 5) {
                        char.rest += 5
                    } else {
                        char.rest = 10
                    }
                })
                if (dayTimer <= 5999) {
                    dayTimer += 4000
                } else {
                    let time = 10000 - dayTimer
                    dayTimer = 0 + time
                    dayCounter += 1
                }
                break;
        }
        gameChars.forEach(char => char.updateMood())
        dayDisplay.innerHTML = dayCounter
        foodDisplay.innerHTML = gameStats.food
        waterDisplay.innerHTML = gameStats.water
    }

    // Handle Scavenging
    function openScavenge() {
        gameStats.gamePaused = true
        gamePopUp.style.display="block"

        gamePopText.insertAdjacentHTML(
            "afterbegin",
            "<h2>Scavenging</h2><p>Who will scavenge and who will rest...</p>")

        gameChars.forEach((char) => {
            if (char.health <= 2){
                gamePopText.insertAdjacentHTML("beforeend", `
                <fieldset id="${char.name}-scav-options">
                <legend>${char.name}</legend>
                <label for="${char.name}-scav-rest">Rest</label>
                <input type="radio" value="rest" name="${char.name}-scav-options" id="${char.name}-scav-rest" checked>
                <p>${char.name} is unable to scavenge...</p>
                </fieldset>`)           
            } else {
                gamePopText.insertAdjacentHTML("beforeend", `
                <fieldset id="${char.name}-scav-options">
                <legend>${char.name}</legend>
                <label for="${char.name}-scav-rest">Rest</label>
                <input type="radio" value="rest" name="${char.name}-scav-options" id="${char.name}-scav-rest" checked>
                <label for="${char.name}-scav-scav">Scavenge</label>
                <input type="radio" value="scavenge" name="${char.name}-scav-options" id="${char.name}-scav-scav">
                </fieldset>`)
            }
        })

        gameChoices.insertAdjacentHTML("afterbegin", "<button id='go-scavenge'>Scavenge</button>")
        gameChoices.addEventListener("click", (e) => {
            if (e.target && e.target.id == "go-scavenge") {
                handleScavenge()
                gameChoices.innerHTML = ""
            }
        })
        closePopBtn.innerHTML = "Close"
    }

    function handleScavenge() {
        closePopBtn.innerHTML = "Okay"
        // Get our options for scavenging and resting
        let scavOptions = []
        let option
        let name
        let value
        gameChars.forEach(char => {
            option = document.querySelector(`input[name="${char.name}-scav-options"]:checked`)
            name = option.id.split("-")[0]
            value = option.value
            scavOptions.push({name: name, job: value})
        })
        let rested = scavOptions.filter(option => option.job == "rest").map(option => option.name)
        let scavenged = scavOptions.filter(option => option.job == "scavenge").map(option => option.name)

        // Deal with our options
        if (scavenged.length == 0) {
            // If player decides not to scavenge for some reason
            gameChars.forEach((char) => {
                if (char.rest <= 5) {
                    char.rest += 5
                } else {
                    char.rest = 10
                }
            })
            gamePopText.innerHTML = "<p>Everybody rested...</p>"
        } else {
            // If player sends characters to scavenge
            let result = Math.floor(Math.random() * 6)
            if (result == 0) {
                // Good outcome!
                let foundWater = Math.floor(Math.random() * 4) + 4
                let foundFood = Math.floor(Math.random() * 4) + 4
                let randItem = pickUps[Math.floor(Math.random() * pickUps.length)]
                gameStats.water += foundWater
                gameStats.food += foundFood
                inventory.push(randItem)
                if (!rested.length) {
                    gamePopText.innerHTML = `
                    <h2>Scavenging went well...</h2>
                    <p>${scavenged} found ${foundWater}l of water, ${foundFood}kg of food, and a ${randItem}.</p>`  
                } else {
                    gamePopText.innerHTML = `
                    <h2>Scavenging went well...</h2>
                    <p>${scavenged} found ${foundWater}l of water, ${foundFood}kg of food, and a ${randItem}.</p>
                    <p>${rested} rested.</p>`                      
                }               
            } else if (result == 1) {
                // Bad outcome!
                let foundWater = 1
                let foundFood = 1
                gameStats.water += foundWater
                gameStats.food += foundFood
                if (!rested.length) {
                    gamePopText.innerHTML = `
                    <h2>Scavenging went poorly...</h2>
                    <p>${scavenged} found ${foundWater}l of water and ${foundFood}kg of food.</p>`  
                } else {
                    gamePopText.innerHTML = `
                    <h2>Scavenging went poorly...</h2>
                    <p>${scavenged} found ${foundWater}l of water and ${foundFood}kg of food.</p>
                    <p>${rested} rested.</p>`                      
                }       
            } else {
                // Eh, okay outcome
                let foundWater = Math.floor(Math.random() * 2) + 2
                let foundFood = Math.floor(Math.random() * 2) + 2
                gameStats.water += foundWater
                gameStats.food += foundFood
                if (!rested.length) {
                    gamePopText.innerHTML = `
                    <h2>Scavenging went okay...</h2>
                    <p>${scavenged} found ${foundWater}l of water and ${foundFood}kg of food.</p>`  
                } else {
                    gamePopText.innerHTML = `
                    <h2>Scavenging went okay...</h2>
                    <p>${scavenged} found ${foundWater}l of water and ${foundFood}kg of food.</p>
                    <p>${rested} rested.</p>`                      
                }      
            }
            // Recharge resting characters
            if (rested.length) {
                gameChars.forEach((char) => {
                    if (rested.includes(gameChars.name)) {
                        if (char.rest <= 5) {
                            char.rest += 5
                        } else {
                            char.rest = 10
                        }                        
                    }
                })
            }
        }
        // Regardless if all rested or all scavenged, time will pass
        if (dayTimer <= 7999) {
            dayTimer += 2000
        } else {
            let time = 10000 - dayTimer
            dayTimer = 0 + time
            dayCounter++
        }
    }

    // Handle inventory
    function openInventory() {
        gameStats.gamePaused = true
        gamePopUp.style.display="block"

        if (inventory.length) {
            gamePopText.innerHTML = `
            <h2>Inventory</h2>
            <p>You have ${gameStats.food}kg of food</p>
            <p>You have ${gameStats.water}l of water</p>
            <p>You also have ${inventory}</p>
            `            
        } else {
            gamePopText.innerHTML = `
            <h2>Inventory</h2>
            <p>You have ${gameStats.food}kg of food</p>
            <p>You have ${gameStats.water}l of water</p>
            <p>You have no other items.</p>
            `          
        }
    }

    // Display stats
    function openStats() {
        gameStats.gamePaused = true
        gamePopUp.style.display="block"

        gamePopText.insertAdjacentHTML("afterbegin", "<h2>Status</h2>")

        gameChars.forEach((char) => {
            if (!char.status.length && !char.injury.length) {
                gamePopText.insertAdjacentHTML("beforeend",
                `<p>${char.name} is fine.</p>`)
            } else if (!char.status.length && char.injury.length) {
                gamePopText.insertAdjacentHTML("beforeend",
                `<p>${char.name} has ${char.injury}.</p>`)
            } else if (char.status.length && !char.injury.length) {
                gamePopText.insertAdjacentHTML("beforeend",
                `<p>${char.name} is ${char.status}.</p>`)
            } else {
                gamePopText.insertAdjacentHTML("beforeend",
                `<p>${char.name} is ${char.status} and has ${char.injury}.</p>`)
            }
        })
    }

    // Check for end conditions...
    function checkEnd() {
        if (dayCounter > 1) {
            if (kmsToGo <= 0) {
                gameStats.gameOver = true
                document.querySelector("#km-count").innerHTML = 100
                document.querySelector("#day-count").innerHTML = dayCounter
                document.querySelector("#outcome").innerHTML = "And made it to your destination."
                document.querySelector("#game-over").style.display="block"
            }
            if (!gameChars.length) {
                gameStats.gameOver = true
                document.querySelector("#km-count").innerHTML = 100 - kmsToGo
                document.querySelector("#day-count").innerHTML = dayCounter
                document.querySelector("#outcome").innerHTML = "But you didn't make it..."
                document.querySelector("#game-over").style.display="block"
            }            
        }
    }

    // Generic close pop up btn function to clear pop up, unpause and hide pop up
    function closePopUpBtn() {
        closePopBtn.innerHTML = "Okay"
        gameChoices.innerHTML = ""
        gamePopText.innerHTML = ""
        gameStats.gamePaused = false
        gamePopUp.style.display="none"
    }

    const background = new Background()
    const sky = new Sky()
    const ground = new Ground()

    function runGame(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, gameWidth, gameHeight)
        background.draw(ctx)
        background.update()
        handleBuildings()
        handleBgTrees(deltaTime)
        ground.draw(ctx)
        ground.update()
        handleCharacters(ctx, deltaTime)
        handlePeople()
        handleAnimals(ctx, deltaTime)
        if (hasCat) {
            cat.draw(ctx)
            cat.update(deltaTime)
        }
        if (hasDog) {
            dog.draw(ctx)
            dog.update(deltaTime)
        }
        handleFgTrees(deltaTime)
        if (gameStats.weather == 'Rain') {
            sky.draw(ctx)
            sky.update()    
        }
        if (!gameStats.gamePaused) {
            manageDays()
        }
        checkEnd()
        if (!gameStats.gameOver) {
            requestAnimationFrame(runGame)
        }
    }

    startBtn.addEventListener("click", () => {
        runGame()
        createCharPop.style.display="block"
    })
    resetBtn.addEventListener("click", () => {
        location.reload() 
    })
})