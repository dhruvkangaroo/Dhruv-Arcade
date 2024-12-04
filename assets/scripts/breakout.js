window.addEventListener("load", () => {

    const startButton = document.getElementById("start")
    const reset = document.getElementById("reset")
    const score = document.getElementById("score")
    const highScoreDisplay = document.getElementById("high-score")
    const result = document.getElementById("result")

    this.window.addEventListener("mousedown", keyDownHandler)
    this.window.addEventListener("mouseup", keyUpHandler)
    document.addEventListener("keydown", keyDownHandler)
    document.addEventListener("keyup", keyUpHandler)

    let highScore = parseInt(localStorage.getItem("highScore"))
    if (isNaN(highScore)) {
        console.log(highScore)
        highScore = 0
    }
    highScoreDisplay.innerHTML = highScore

    // Change scale depending on window width or height
    let scale = 2
    let winW = window.innerWidth
    let winH = window.innerHeight
    console.log(winW, winH)
    if (winW > 800 || winH > 800) {
        scale = 2
    } else {
        scale = 1
    }

    canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")

    const gameWidth = 300
    const gameHeight = 300
    canvas.width = gameWidth * scale
    canvas.height = gameHeight * scale
    let speed = 2 * scale
    let currentScore = 0
    let gameNextRound = true
    let gameOver = false

    let rightPressed = false
    let leftPressed = false



    // Create ball and paddle and bricks
    let ball = {
        x: canvas.width / 2,
        y: canvas.height - 50,
        dx: speed,
        dy: -speed + 1,
        radius: 5 * scale,
        draw: function() {
            ctx.beginPath()
            ctx.fillStyle = "#282828"
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
            ctx.closePath()
            ctx.fill()
        } 
    }

    let paddle = {
        height: 6 * scale,
        width: 60 * scale,
        x: (canvas.width / 2) - (60 * scale / 2),
        draw: function() {
            ctx.beginPath()
            ctx.rect(this.x, canvas.height - this.height, this.width, this.height)
            ctx.fillStyle = "#04650D"
            ctx.closePath()
            ctx.fill()
        }
    }

    let brickRowCount = 3
    let brickColumnCount = 5
    let brickWidth = 50 * scale
    let brickHeight = 10 * scale
    let brickSpace = 8 * scale
    let brickOffsetTop = 20 * scale
    let brickOffsetLeft = 9 * scale
    let bricks = []

    function generateBricks() {
        for (let col = 0; col < brickColumnCount; col++) {
            bricks[col] = []
            for (let row = 0; row < brickRowCount; row++) {
                bricks[col][row] = {x: 0, y: 0, status: 1}
            }
        }
    }

    function drawBricks() {
        for (let col = 0; col < brickColumnCount; col++) {
            for (let row = 0; row < brickRowCount; row++) {
                if (bricks[col][row].status === 1) {
                    let brickX = col * [brickWidth + brickSpace] + brickOffsetLeft
                    let brickY = row * [brickHeight + brickSpace] + brickOffsetTop
                    bricks[col][row].x = brickX
                    bricks[col][row].y = brickY
                    ctx.beginPath()
                    ctx.rect(brickX, brickY, brickWidth, brickHeight)
                    ctx.fillStyle = '#25C40D'
                    ctx.fill()
                    ctx.closePath()
                }
            }
        }
    }

    // Handle Inputs
    function keyDownHandler(e) {
        if (e.code == "ArrowRight" || e.code == "KeyD" || e.target.id == "right") {
            rightPressed = true
        } else if (e.code == "ArrowLeft" || e.code == "KeyA" || e.target.id == "left") {
            leftPressed = true
        }
    }

    function keyUpHandler(e) {
        if (e.code == "ArrowRight" || e.code == "KeyD" || e.target.id == "right") {
            rightPressed = false
        } else if (e.code == "ArrowLeft" || e.code == "KeyA" || e.target.id == "left") {
            leftPressed = false
        }
    }

    function movePaddle() {
        if (rightPressed) {
            paddle.x += 6
            if (paddle.x + paddle.width >= canvas.width) {
                paddle.x = canvas.width - paddle.width
            }
        } else if (leftPressed) {
            paddle.x -= 6
            if (paddle.x < 0) {
                paddle.x = 0
            }
        }
    }

    // Handle Collision
    function collisionDetection() {
        for (let col = 0; col < brickColumnCount; col++) {
            for (let row = 0; row < brickRowCount; row++) {
                let brick = bricks[col][row]
                if (brick.status === 1) {
                    if (ball.x >= brick.x && ball.x <= brick.x + brickWidth && ball.y >= brick.y && ball.y <= brick.y + brickHeight) {
                        ball.dy *= -1
                        brick.status = 0
                        currentScore ++
                    }
                }
            }
        }
    }

    // Next Round
    let threshold = 15
    function nextRound() {
        if (currentScore % threshold == 0 && currentScore != 0) {
            if (ball.y > canvas.height / 2) {
                brickRowCount++
                threshold = threshold + brickColumnCount * brickRowCount
                console.log(threshold)
                generateBricks()
            }
            if (gameNextRound) {
                if (ball.dy > 0) {
                    ball.dy +=1
                    gameNextRound = false
                } else if (ball.dy < 0) {
                    ball.dy -=1
                    gameNextRound = false
                }
            }
            if (currentScore % (threshold) != 0) {
                gameNextRound = true
            }
        }
    }

    // Play game
    function play() {
        startButton.removeEventListener("click", play)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ball.draw()
        paddle.draw()
        movePaddle()
        drawBricks()
        collisionDetection()
        nextRound()

        ball.x += ball.dx
        ball.y += ball.dy

        // Bounce off edges
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.dx *= -1
        } 
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            ball.dy *= -1
        }
        // Bounce off paddle
        if (ball.x >= paddle.x && ball.x <= paddle.x + paddle.width && ball.y + ball.radius >= canvas.height - paddle.height) {
            ball.dy *= -1
        }
        checkEnd()
        score.innerHTML = currentScore
        if (!gameOver) {
            requestAnimationFrame(play)
        }

    }

    // Check End
    function checkEnd() {
        if (ball.y + ball.radius > canvas.height) {
            if (currentScore > parseInt(localStorage.getItem("highScore"))) {
                localStorage.setItem("highScore", currentScore.toString())
                highScoreDisplay.innerHTML = currentScore
            }
            result.innerHTML = currentScore
            document.querySelector("#game-over").style.display="block"
            gameOver = true
            currentScore = 0
            brickRowCount = 3
            ball.dx = speed
            ball.dy = -speed + 1
            generateBricks()
        }
    }

    generateBricks()
    startButton.addEventListener("click", play)
    reset.addEventListener("click", () => {
        localStorage.setItem("highScore", "0")
        location.reload()
    })
})