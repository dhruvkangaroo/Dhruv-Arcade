const startBtn = document.getElementById("start")
const reset = document.getElementById("reset")
const currentBet = document.getElementById("curr-bet")
const currentChips = document.getElementById("player-chips")
const dealerCards = document.getElementById("dealer-area")
const playerCards = document.getElementById("player-area")
const hitMe = document.getElementById("hit-me")
const stay = document.getElementById("stay")
const options = document.getElementById("player-options")
const betPop = document.getElementById("bet")
const betBtn = document.getElementById("enter-bet")
const userBet = document.getElementById("user-bet")
const gameOver = document.getElementById("game-over")
const endHand = document.getElementById("end-hand")
const handResult = document.getElementById("hand-result")
const nextHand = document.getElementById("next-hand")
const incBet = document.getElementById("increment")
const decBet = document.getElementById("decrement")

const suits = ["hearts", "diams", "clubs", "spades"]
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
let deck = []
let deadCards = []
let playerHand = []
let playerScore = 0
let dealerHand = []
let dealerScore = 0
let playerBet = 0
let playerChips = 100
let hit = false
let handOver = false

// Create the card deck
function createDeck() {
    for (let i = 0; i < ranks.length; i++) {
        for (let j = 0; j < suits.length; j++) {
            let value = parseInt(ranks[i])
            if (ranks[i] == "J" || ranks[i] == "Q" || ranks[i] == "K") {
                value = 10
            }
            if (ranks[i] == "A") {
                value = 11
            }
            let card = {
                rank: ranks[i],
                suit: suits[j],
                value: value
            }
            deck.push(card)
        }
    }
    shuffleDeck()
}

// Shuffle the card deck - Fisher Yates?
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        let randPos = Math.floor(Math.random() * (i + 1))
        let temp = deck[randPos]
        deck[randPos] = deck[i]
        deck[i] = temp
    }
    betBtn.addEventListener("click", placeBet)
    betPop.style.display = "flex"
}

// Place a bet at the start of a round
function placeBet() {
    playerBet = parseInt(userBet.value)
    playerChips -= playerBet
    currentBet.innerHTML = playerBet
    currentChips.innerHTML = playerChips
    betPop.style.display = "none"
    betBtn.removeEventListener("click", placeBet)
    dealCards()
}

// Deal cards
function dealCards() {
    let card = {}
    // Deal cards to hand
    if (playerHand.length < 2) {
        let i = 1
        while (i < 5) {
            card = deck.pop()
            if (i % 2 == 0) {
                playerHand.push(card)
                renderHand(card, "player")
                playerScore += card.value
            } else {
                dealerHand.push(card)
                renderHand(card, "dealer")
                dealerScore += card.value
            }
            i++
        }
    } else {
        if (hit) {
            card = deck.pop()
            playerHand.push(card)
            renderHand(card, "player")
            playerScore += card.value
        }
        if ((dealerScore < 21 && dealerScore < playerScore) || (dealerScore < 17)) {
            card = deck.pop()
            dealerHand.push(card)
            renderHand(card, "dealer")
            dealerScore += card.value
        }
    }
    console.log(deck)
    playRound()
}

// Add card to player's area
function renderHand(card, player) {
    let hand = document.getElementById(player + "-area")
    let newCard = document.createElement("div")
    newCard.className = "card"
    newCard.innerHTML = `
    &${card.suit};
    <br>
    <br>
    ${card.rank}
    `
    hand.appendChild(newCard)
    if (player == "dealer") {
        hand.firstChild.className = "hidden-card"
    }
}

// Play a round
function playRound() {
    options.style.display = "block"
    checkScore()
}

hitMe.addEventListener("click", () => {
    hit = true
    dealCards()
})
stay.addEventListener("click", () => {
    hit = false
    handOver = true
    while (handOver) {
        dealCards()        
    }
})

// Play another round
function nextRound() {
    endHand.style.display = "none"
    options.style.display = "none"
    playerScore = 0
    dealerScore = 0
    let card = {}
    for (let i = 0; i < playerHand.length; i++) {
        card = playerHand.shift()
        deck.push(card)
        i--
    }
    for (let i = 0; i < dealerHand.length; i++) {
        card = dealerHand.shift()
        deck.push(card)
        i--
    }
    shuffleDeck()
    document.getElementById("player-area").innerHTML = ""
    document.getElementById("dealer-area").innerHTML = ""
    betBtn.addEventListener("click", placeBet)
    betPop.style.display = "flex"
}

// Check scores
function checkScore() {
    console.log("Player chips: " + playerChips)
    console.log("Player bet: " + playerBet)
    if (playerScore > 21) {
        // You lose
        return youLose()
    } else if (playerScore == 21) {
        // You win
        return youWin()
    } else if (playerScore >= 17 && playerScore == dealerScore && !hit) {
        // Tie
        return youTie()
    }
    if (dealerScore > 21 && playerScore <= 21) {
        // You win
        return youWin()
    } else if (dealerScore == 21) {
        // You lose
        return youLose()
    } else if (handOver && dealerScore > playerScore) {
        // You lose
        return youLose()
    }
}

// Refactor - stop repeating yourself
function youLose() {
    if (playerChips == 0) {
        gameOver.style.display = "block"
    } else {
        endHand.style.display = "block"
        handResult.innerHTML = "You lost!"
        nextHand.addEventListener("click", nextRound)
    }
    dealerCards.firstChild.className = "card"
    handOver = false
    console.log("Called loss")
}

function youWin() {
    playerChips += playerBet * 2
    endHand.style.display = "block"
    handResult.innerHTML = `You won ${playerBet * 2}!`
    nextHand.addEventListener("click", nextRound)
    dealerCards.firstChild.className = "card"
    handOver = false
    console.log("Called win")
}

function youTie() {
    playerChips += playerBet
    endHand.style.display = "block"
    handResult.innerHTML = `It's a tie. You get your bet back.`
    nextHand.addEventListener("click", nextRound)
    dealerCards.firstChild.className = "card"
    handOver = false
    console.log("Called tie")
}

// Change bet
incBet.addEventListener("click", () => {
    let bet = parseInt(userBet.value)
    bet++
    userBet.value = bet    
})
decBet.addEventListener("click", () => {
    let bet = parseInt(userBet.value)
    bet--
    userBet.value = bet     
})

function startGame() {
    startBtn.removeEventListener("click", startGame)
    createDeck()
}
startBtn.addEventListener("click", startGame)
reset.addEventListener("click", () => {
    location.reload()
})