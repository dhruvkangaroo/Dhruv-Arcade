window.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("board");
    const userBtns = document.getElementById("user-input");
    const checkBoard = document.getElementById("check");
    const solveBoard = document.getElementById("solve");
    const newGame = document.getElementById("start");
    const resetBtn = document.getElementById("reset")
    const noteBtn = document.getElementById("note");
    const msgDisplay = document.getElementById("message-text");
    const msgBtn = document.getElementById("message-button");
    const giveUpBtn = document.getElementById("give-up-button");
  
    let solution = [];
    let cells = [];
    let activeCell;
    let addNotes = false;
    let time = 0
    let startTime
  
    const exampleBox = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
  
    // Example puzzle - solvable
    const examplePuzzle = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [4, 5, 6, 7, 8, 9, 1, 2, 3],
      [7, 8, 9, 1, 2, 3, 4, 5, 6],
      [2, 3, 1, 5, 6, 4, 8, 9, 7],
      [5, 6, 4, 8, 9, 7, 2, 3, 1],
      [8, 9, 7, 2, 3, 1, 5, 6, 4],
      [3, 1, 2, 6, 4, 5, 9, 7, 8],
      [6, 4, 5, 9, 7, 8, 3, 1, 2],
      [9, 7, 8, 3, 1, 2, 6, 4, 5],
    ];
  
    // Generic shuffle function
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    };
  
    // Rotate the board
    const rotateBoard = (board) => {
      const length = board.length;
  
      let temp = Array.from(Array(length), () => Array.from(Array(length)));
  
      for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
          let element = board[i][j];
          let index = length - (i + 1);
  
          temp[j][index] = element;
        }
      }
      return temp;
    };
  
    // Shuffle the rows
    const shuffleRows = (board) => {
      return [
        shuffleArray(board.slice(0, 3)),
        shuffleArray(board.slice(3, 6)),
        shuffleArray(board.slice(6)),
      ].flat();
    };
  
    const randomiseBoard = (board) => {
      let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      // Then lets randomly shuffle the numbers with Fisher-Yates
      let shuffledNumbers = shuffleArray(numbers);
      // Now we want to swap the numbers in the board
      const conversion = {};
      shuffledNumbers.forEach((element, i) => (conversion[i + 1] = element));
  
      // Shuffle the rows, rotate the board, shuffle the columns, rotate the board back
      let shuffledBoard = shuffleRows(board);
      let rotatedBoard = rotateBoard(shuffledBoard);
      let shuffledColumns = shuffleRows(rotatedBoard);
      for (let i = 0; i < 3; i++) {
        shuffledColumns = rotateBoard(shuffledColumns);
      }
      return shuffledColumns;
    };
  
    const createAnswerArray = (board, shownNumbers) => {
      let answerArray = [];
      while (answerArray.length < 9) {
        let row = [];
        while (row.length < 9) {
          let flipCoin = Math.floor(Math.random() * 2);
          if (flipCoin === 1 && shownNumbers > 0) {
            row.push(board[answerArray.length][row.length]);
            shownNumbers--;
          } else {
            row.push(null);
          }
        }
        answerArray.push(row);
      }
      return answerArray;
    };
  
    const createBoard = (board) => {
      let answerBoard = [];
      // Gets dicey to find a unique solution if lower than 34 (still a few spins to find a unique solution)
      let shownNumbers = 34;
      // Randomise the example board, and create an answer board
      let newBoard = randomiseBoard(board);
      answerBoard = createAnswerArray(newBoard, shownNumbers);
      // Test for unique solution
      let solutions = 0;
      let testForward = answerBoard.map((row) => row.slice());
      if (solver(testForward, "forward")) {
        solutions++;
      }
      let testBackward = answerBoard.map((row) => row.slice());
      if (solver(testBackward, "backward")) {
        solutions++;
      }
      // If there is a unique solution, display the board, or roll again
      if (solutions > 1) {
        if (compareBoards(testForward, testBackward, "solve")) {
          solution = testForward;
          displayBoard(answerBoard);
        } else {
          createBoard(board);
        }
      } else if (solutions === 0) {
        createBoard(board);
      }
    };
  
    const displayBoard = (board) => {
      board.forEach((row) => {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        row.forEach((cell) => {
          let cellDiv = document.createElement("div");
          cellDiv.classList.add("cell");
          if (cell === null) {
            cellDiv.classList.add("guess");
          } else {
            cellDiv.innerText = cell;
            cellDiv.classList.add("solution");
          }
          cellDiv.addEventListener("click", selectCell);
          rowDiv.appendChild(cellDiv);
        });
        gameBoard.appendChild(rowDiv);
      });
      cells = document.querySelectorAll(".cell");
    };
  
    // Check if the number is valid
    const isValid = (board, row, col, num) => {
      for (let i = 0; i < 9; i++) {
        if (board[row][i] == num || board[i][col] == num) {
          return false;
        }
      }
  
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
          if (board[i][j] == num) {
            return false;
          }
        }
      }
      return true;
    };
  
    // Solver function
    const solver = (board, direction) => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] == null) {
            if (direction === "forward") {
              for (let k = 1; k <= 9; k++) {
                if (isValid(board, i, j, k)) {
                  board[i][j] = k;
                  if (solver(board, direction)) {
                    return true;
                  } else {
                    board[i][j] = null;
                  }
                }
              }
            } else if (direction === "backward") {
              for (let k = 9; k >= 1; k--) {
                if (isValid(board, i, j, k)) {
                  board[i][j] = k;
                  if (solver(board, direction)) {
                    return true;
                  } else {
                    board[i][j] = null;
                  }
                }
              }
            }
            return false;
          }
        }
      }
      return true;
    };
  
    // Compare two boards
    const compareBoards = (board1, board2, option) => {
      let wrongCells = [];
      let correct = true;
      for (let i = 0; i < board1.length; i++) {
        for (let j = 0; j < board1[i].length; j++) {
          if (board1[i][j] !== board2[i][j]) {
            if (option === "check" && board2[i][j] !== null) {
              wrongCells.push([i, j]);
            } else if (option === "solve") {
              correct = false;
            }
          }
        }
        if (option === "check") {
          wrongCells.forEach((cell) => {
            let row = cell[0];
            let col = cell[1];
            let cellDiv = document.querySelector(
              `.row:nth-child(${row + 1}) .cell:nth-child(${col + 1})`
            );
            cellDiv.classList.add("wrong");
          });
        } else if (option === "solve") {
          return correct;
        }
      }
    };
  
    // Check the user's solution
    const checkUserAnswer = (solution, option) => {
      let usersAnswerBoard = document.querySelectorAll(".cell");
      let usersAnswerArray = Array.from(usersAnswerBoard).map((cell) => {
        if (cell.innerText === "") {
          return null;
        } else {
          return parseInt(cell.innerText);
        }
      });
      let user2DArray = [];
      while (usersAnswerArray.length) {
        user2DArray.push(usersAnswerArray.splice(0, 9));
      }
      if (option === "check") {
        if (compareBoards(solution, user2DArray, "check")) {
          displayMessage("No incorrect numbers!");
        } else {
          displayMessage("There are incorrect/missing numbers!");
        }
      } else if (option === "solve") {
        if (compareBoards(solution, user2DArray, "solve")) {
          displayMessage("You've solved the puzzle!");
          endGame("solved it")
        } else {
          displayMessage(
            "You have not solved the puzzle..."
          );
          document.getElementById("give-up").style.display = "block";
        }
      }
    };
  
    // Making a cell active
    const selectCell = (e) => {
      activeCell = e.target;
      if (activeCell.classList.contains("guess")) {
        activeCell.classList.add("active");
      }
      for (let i = 0; i < cells.length; i++) {
        if (cells[i] !== activeCell) {
          cells[i].classList.remove("active");
        }
      }
    };
  
    // Creating the number buttons
    const createButtons = () => {
      for (let i = 1; i < 11; i++) {
        let btn = document.createElement("button");
        if (i === 10) {
          btn.innerText = "clear";
        } else {
          btn.innerText = i;
        }
        btn.classList.add("btn");
        btn.addEventListener("click", selectButton);
        userBtns.appendChild(btn);
      }
    };
  
    // Selecting cell
    const selectButton = (e) => {
      if (activeCell.classList.contains("active")) {
        if (e.target.innerText === "clear") {
          activeCell.innerText = "";
        } else if (addNotes) {
          activeCell.insertAdjacentHTML(
            "beforeend",
            `<span class="note">${e.target.innerText}</span>`
          );
        } else {
          activeCell.innerText = e.target.innerText;
          if (activeCell.classList.contains("wrong")) {
            activeCell.classList.remove("wrong");
          }
        }
      }
    };
  
    noteBtn.addEventListener("click", () => {
      addNotes = !addNotes;
      if (addNotes) {
        noteBtn.classList.add("active");
      } else {
        noteBtn.classList.remove("active");
      }
    });
  
    const displayMessage = (message) => {
      document.getElementById("message").style.display = "block";
      msgDisplay.innerText = message;
    };
  
    const giveUp = () => {
      document.getElementById("give-up").style.display = "none";
      displayMessage("The solution is...");
      gameBoard.innerHTML = "";
      displayBoard(solution);
      clearInterval(startTime)
      setTimeout(() => {
        endGame("gave up")
      }, 2000)
    };

    const endGame = (result) => {
        document.getElementById("game-over").style.display = "block"
        document.getElementById("result").innerHTML = result
        document.getElementById("time").innerHTML = time
        clearInterval(startTime)
    }
  
    const startGame = () => {
      gameBoard.innerHTML = "";
      userBtns.style.display = "flex"
      document.getElementById("note-input").style.display = "flex"
      document.getElementById("buttons").style.display = "flex"
      time = 0
      clearInterval(startTime)
      timer()
      createBoard(examplePuzzle);

    };

    const timer = () => {
        startTime = setInterval(() => {
            time ++
            document.getElementById("timer").innerHTML = time
        }, 1000)
    }

    createButtons();
    newGame.addEventListener("click", startGame);
    checkBoard.addEventListener("click", () =>
      checkUserAnswer(solution, "check")
    );
    solveBoard.addEventListener("click", () =>
      checkUserAnswer(solution, "solve")
    );
    msgBtn.addEventListener("click", () => {
      msgDisplay.innerText = "";
      document.getElementById("give-up").style.display = "none"
      document.getElementById("message").style.display = "none";
    });
    giveUpBtn.addEventListener("click", giveUp);
    resetBtn.addEventListener("click", () => {
        location.reload()
    })
  });
  