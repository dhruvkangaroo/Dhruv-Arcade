const games = [
    { title: "Anagram Game", href: "../html/anagram.html", label: "Anagram game" },
    { title: "Apocalypse Trail", href: "../html/trail.html", label: "Apocalypse Trail game" },
    { title: "Blackjack", href: "../html/blackjack.html", label: "Blackjack game" },
    { title: "Breakout", href: "../html/breakout.html", label: "Breakout game" },
    { title: "Codebreaker", href: "../html/codebreaker.html", label: "Codebreaker game" },
    { title: "Connect 4", href: "../html/connect.html", label: "Connect 4 game" },
    { title: "Dead Heads Memory Game", href: "../html/memory-cards.html", label: "Dead Heads memory card game" },
    { title: "Deli Master", href: "../html/deli.html", label: "Deli Master game" },
    { title: "Fishtank", href: "../html/fishtank.html", label: "Fishtank game" },
    { title: "Goose Shoot", href: "../html/goose.html", label: "Goose shoot game" },
    { title: "Guessagram", href: "../html/guessagram.html", label: "Guessagram game" },
    { title: "Guess Who", href: "../html/guesswho.html", label: "Guess Who game" },
    { title: "Hangman", href: "../html/hangman.html", label: "Hangman game" },
    { title: "Hide & Seek", href: "../html/hide-seek.html", label: "Hide & Seek text adventure game" },
    { title: "Hoof Hustle", href: "../html/racing.html", label: "Racing game" },
    { title: "Minesweeper", href: "../html/minesweeper.html", label: "Minesweeper game" },
    { title: "Missing Item Game", href: "../html/missing-item.html", label: "Missing Item game" },
    { title: "Monkey Run", href: "../html/monkey-run.html", label: "Monkey Run game" },
    { title: "Pirates?", href: "../html/pirate.html", label: "Pirate game" },
    { title: "Pixel's Quiz", href: "../html/quiz.html", label: "Quiz game" },
    { title: "Rock Paper Scissors", href: "../html/rps.html", label: "Rock, Paper, Scissors game" },
    { title: "Slap-a-Rabbit", href: "../html/rabbit.html", label: "Slap-a-Rabbit game" },
    { title: "Sheepdog Trials", href: "../html/sheepdog.html", label: "Sheepdog trials game" },
    { title: "Simon", href: "../html/simon.html", label: "Simon game" },
    { title: "Sliding Puzzle", href: "../html/sliding.html", label: "Sliding puzzle game" },
    { title: "Snake", href: "../html/snake.html", label: "Snake game" },
    { title: "Space Invaders", href: "../html/invaders.html", label: "Space Invaders game" },
    { title: "Stock Boy", href: "../html/stockboy.html", label: "Stock boy game" },
    { title: "Sudoku", href: "../html/sudoku.html", label: "Sudoku game" },
    { title: "Survive the Horde", href: "../html/survive.html", label: "Survive the Horde game" },
    { title: "Typing Test", href: "../html/typing.html", label: "Typing test game" },
    { title: "Vroom Vroom", href: "../html/vroom.html", label: "Vroom vroom game" },
    { title: "Wordegories", href: "../html/wordegories.html", label: "Wordegories game" },
    { title: "Word Search", href: "../html/wordsearch.html", label: "Word search game" },
    { title: "Skull Swap", href: "../html/matchthree.html", label: "Skull swap match-3 game"},
  ]
  

document.addEventListener("DOMContentLoaded", () => {
    const gameList = document.getElementById("list-of-games")
    games.sort((a, b) => a.title.localeCompare(b.title))

    for (let game of games) {
        const listItem = document.createElement("li")
        const linkItem = document.createElement("a")
        linkItem.href = game.href
        linkItem.ariaLabel = game.label
        linkItem.innerHTML = game.title
        listItem.appendChild(linkItem)
        gameList.appendChild(listItem)
    }

})