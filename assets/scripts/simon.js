const counter = document.getElementById("score")
const firstColor = document.getElementById("firstcolor")
const secondColor = document.getElementById("secondcolor")
const thirdColor = document.getElementById("thirdcolor")
const fourthColor = document.getElementById("fourthcolor")
const fifthColor = document.getElementById("fifthcolor")
const sixthColor = document.getElementById("sixthcolor")
const seventhColor = document.getElementById("seventhcolor")
const eighthColor = document.getElementById("eighthcolor")
const ninthColor = document.getElementById("ninthcolor")
const smallBoard = document.getElementById("foursquares")
const medBoard = document.getElementById("sixsquares")
const largeBoard = document.getElementById("ninesquares")
const reset = document.getElementById("reset")
const strictButton = document.getElementById("strict")
const fastButton = document.getElementById("faster")
const toTen = document.getElementById("to-ten")
const toTwenty = document.getElementById("to-twenty")
const endless = document.getElementById("endless")
const start = document.getElementById("start")

let order = []
let playerOrder = []
let computerTurn
let flash
let turn
let good
let intervalId
let strict = false
let fast = false
let gameSpeed = 0
let win
let rounds = 20
let boardSize = 4

strictButton.addEventListener("click", () => {
  strict = strictButton.checked
})

fastButton.addEventListener("click", () => {
  fast = fastButton.checked
})

smallBoard.addEventListener("click", () => {
  location.reload()
})

medBoard.addEventListener("click", medium)

largeBoard.addEventListener("click", large)

function medium() {
  boardSize = 6
  fifthColor.style.display = "flex"
  sixthColor.style.display = "flex"
  seventhColor.style.display = "none"
  eighthColor.style.display = "none"
  ninthColor.style.display = "none"
  let colors = document.querySelectorAll(".colour")
  if (screen.width < 380) {
    console.log ("small!")
    document.getElementById("board").style.height = "320px"
    for (let colour of colors) {
      colour.style.width = "38%"
      colour.style.height = "30%"
    }
  } else if (screen.width >= 380 && screen.width < 950) {
    document.getElementById("board").style.height = "280px"
    document.getElementById("board").style.width = "360px"
    for (let colour of colors) {
      colour.style.width = "30%"
      colour.style.height = "37%"
    }
  } else {
    document.getElementById("board").style.width = "750px"
  }

}

function large() {
  boardSize = 9
  fifthColor.style.display = "flex"
  sixthColor.style.display = "flex"
  seventhColor.style.display = "flex"
  eighthColor.style.display = "flex"
  ninthColor.style.display = "flex"
  let colors = document.querySelectorAll(".colour")
  for (let colour of colors) {
    colour.style.width = "30%"
    colour.style.height = "30%"
  }
  if (screen.width < 380) {
    document.getElementById("board").style.width = "320px"
    document.getElementById("board").style.height = "320px"
  } else if (screen.width >= 380 && screen.width < 950) {
    document.getElementById("board").style.width = "360px"
    document.getElementById("board").style.height = "360px"
  } else {
    document.getElementById("board").style.width = "750px"
    document.getElementById("board").style.height = "750px"    
  }

}

function handleListeners() {
    smallBoard.removeEventListener("click", () => {
    location.reload()
  })
  medBoard.removeEventListener("click", medium)
  largeBoard.removeEventListener("click", large)

  if (toTen.checked) {
    rounds = 10
  } else if (toTwenty.checked) {
    rounds = 20
  } else if (endless.checked) {
    rounds = 200
  }
}

function play() {
  handleListeners()
  win = false
  order = []
  playerOrder = []
  flash = 0
  intervalId = 0
  turn = 1
  counter.innerHTML = turn
  good = true

  for (let i = 0; i < rounds; i++) {
      order.push(Math.floor(Math.random() * boardSize) + 1)
  }

  computerTurn = true

  if (fast) {
    gameSpeed = 400
  } else if (fast === false) {
    gameSpeed = 800
  }

  intervalId = setInterval(gameTurn, gameSpeed)
  console.log(gameSpeed)
  console.log(rounds)
}

function gameTurn() {
  if(flash === turn) {
      clearInterval(intervalId)
      computerTurn = false
      clearColor()
      setTimeout(() => {
        addListeners()
      }, 250)
      addListeners()
  }

  if (computerTurn) {
      removeListeners()
      clearColor()
      setTimeout(() => {
          if (order[flash] === 1) one()
          if (order[flash] === 2) two()
          if (order[flash] === 3) three()
          if (order[flash] === 4) four()
          if (order[flash] === 5) five()
          if (order[flash] === 6) six()
          if (order[flash] === 7) seven()
          if (order[flash] === 8) eight()
          if (order[flash] === 9) nine()
          flash++;
      }, 200)
  }
}

function one() {
  firstColor.style.backgroundColor = "#25c40d"
}

function two() {
  secondColor.style.backgroundColor = "#ea0707"
}

function three() {
  thirdColor.style.backgroundColor = "#fbff00"
}

function four() {
  fourthColor.style.backgroundColor = "#003aff"
}

function five() {
  fifthColor.style.backgroundColor = "#bf26bf"
}

function six() {
  sixthColor.style.backgroundColor = "#e3762d"
}

function seven() {
  seventhColor.style.backgroundColor = "#e33993"
}

function eight() {
  eighthColor.style.backgroundColor = "#8bcc8b"
}

function nine() {
  ninthColor.style.backgroundColor = "#8378cc"
}

function clearColor() {
  firstColor.style.backgroundColor = "#04650d"
  secondColor.style.backgroundColor = "#c40d0d"
  thirdColor.style.backgroundColor = "#b4c40d"
  fourthColor.style.backgroundColor = "#0d29c4"
  fifthColor.style.backgroundColor = "#740c74"
  sixthColor.style.backgroundColor = "#bd540e"
  seventhColor.style.backgroundColor = "#c21973"
  eighthColor.style.backgroundColor = "#5f9c5f"
  ninthColor.style.backgroundColor = "#4b4381"
}

function flashColor() {
  firstColor.style.backgroundColor = "#25c40d"
  secondColor.style.backgroundColor = "#ea0707"
  thirdColor.style.backgroundColor = "#fbff00"
  fourthColor.style.backgroundColor = "#003aff"
  fifthColor.style.backgroundColor = "#bf26bf"
  sixthColor.style.backgroundColor = "#e3762d"
  seventhColor.style.backgroundColor = "#e33993"
  eighthColor.style.backgroundColor = "#8bcc8b"
  ninthColor.style.backgroundColor = "#8378cc"
}

function addListeners() {
    firstColor.addEventListener("click", oneClick)
    secondColor.addEventListener("click", twoClick)
    thirdColor.addEventListener("click", threeClick)
    fourthColor.addEventListener("click", fourClick)
    fifthColor.addEventListener("click", fiveClick)
    sixthColor.addEventListener("click", sixClick)
    seventhColor.addEventListener("click", sevenClick)
    eighthColor.addEventListener("click", eightClick)
    ninthColor.addEventListener("click", nineClick)
}

function removeListeners() {
    firstColor.removeEventListener("click", oneClick)
    secondColor.removeEventListener("click", twoClick)
    thirdColor.removeEventListener("click", threeClick)
    fourthColor.removeEventListener("click", fourClick)
    fifthColor.removeEventListener("click", fiveClick)
    sixthColor.removeEventListener("click", sixClick)
    seventhColor.removeEventListener("click", sevenClick)
    eighthColor.removeEventListener("click", eightClick)
    ninthColor.removeEventListener("click", nineClick)
}

function oneClick() {
    playerOrder.push(1)
    check()
    one()
    if (!win) {
        setTimeout(() => {
            clearColor()
        }, 300)
    }
}

function twoClick() {
    playerOrder.push(2)
    check()
    two()
    if (!win) {
        setTimeout(() => {
            clearColor()
        }, 300)
    }
}

function threeClick() {
  playerOrder.push(3)
  check()
  three()
  if (!win) {
      setTimeout(() => {
          clearColor()
      }, 300)
  }
}

function fourClick() {
    playerOrder.push(4)
    check()
    four()
    if (!win) {
        setTimeout(() => {
            clearColor()
        }, 300)
    }
  }

  function fiveClick() {
    playerOrder.push(5)
    check()
    five()
    if (!win) {
        setTimeout(() => {
            clearColor()
        }, 300)
    }
  }

  function sixClick() {
    playerOrder.push(6)
    check()
    six()
    if (!win) {
        setTimeout(() => {
            clearColor()
        }, 300)
    }
  }

  function sevenClick() {
    playerOrder.push(7)
    check()
    seven()
    if (!win) {
        setTimeout(() => {
            clearColor()
        }, 300)
    }
  }

  function eightClick() {
    playerOrder.push(8)
    check()
    eight()
    if (!win) {
        setTimeout(() => {
            clearColor()
        }, 300)
    }
  }

  function nineClick() {
    playerOrder.push(9)
    check()
    nine()
    if (!win) {
        setTimeout(() => {
            clearColor()
        }, 300)
    }
  }

function check() {
  if (playerOrder[playerOrder.length - 1] != order[playerOrder.length - 1]) 
  good = false

  if (playerOrder.length === rounds && good) {
    endGame()
  }

  if (good === false) {
      flashColor()
      counter.innerHTML = "NO"
      if (strict) {
        endGame()
      } else {
          computerTurn = true
          flash = 0
          playerOrder = []
          good = true
          intervalId = setInterval(gameTurn, gameSpeed)
      }
  }

  if (turn === playerOrder.length && good && !win) {
      turn++
      playerOrder = []
      computerTurn = true
      flash = 0
      counter.innerHTML = turn
      intervalId = setInterval(gameTurn, gameSpeed)
  }

  console.log(gameSpeed)
}

function endGame() {
  clearInterval(intervalId)
  counter.innerHTML = turn
  document.querySelector("#end-time").innerHTML = turn
  document.querySelector("#game-over").style.display="block"
}

start.addEventListener("click", play)
reset.addEventListener("click", () => {
  location.reload()
})