//! CONSTANTS

const chosenBoardCols = 10;
const chosenBoardRows = 10;
const chosenNumberOfMines = 20;
const checkMineMap = {
  //These functions return 1 if a mine is found : 0 if not
  1: function (rowIndex, colIndex) {
    return board[rowIndex - 1][colIndex - 1] === "X" ? 1 : 0;
  },
  2: function (rowIndex, colIndex) {
    return board[rowIndex - 1][colIndex] === "X" ? 1 : 0;
  },
  3: function (rowIndex, colIndex) {
    return board[rowIndex - 1][colIndex + 1] === "X" ? 1 : 0;
  },
  4: function (rowIndex, colIndex) {
    return board[rowIndex][colIndex - 1] === "X" ? 1 : 0;
  },
  5: function (rowIndex, colIndex) {
    return board[rowIndex][colIndex + 1] === "X" ? 1 : 0;
  },
  6: function (rowIndex, colIndex) {
    return board[rowIndex + 1][colIndex - 1] === "X" ? 1 : 0;
  },
  7: function (rowIndex, colIndex) {
    return board[rowIndex + 1][colIndex] === "X" ? 1 : 0;
  },
  8: function (rowIndex, colIndex) {
    return board[rowIndex + 1][colIndex + 1] === "X" ? 1 : 0;
  },
};

//! STATE VARIABLES

let board; //2d array board data model
let gameOnEnd; //null if still playing, 1 if board revealed, -1 if mine hit

//! CACHED ELEMENTS

const container = document.getElementById("container");
const grid = document.getElementById("grid");

//! FUNCTIONS
function init() {
  //initialize board data model
  board = [];
  for (let i = 0; i < chosenBoardRows; i++) {
    let boardRow = [];
    for (let i = 0; i < chosenBoardCols; i++) {
      boardRow.push(0);
    }
    board.push(boardRow);
  }
  //Board data model created as 2d array. Console.log(board) lets you visualize the board as it is printed out
  //To access a cell use x,y index eg board[rowIndex][colIndex]

  createBoard();
}

function createBoard() {
  //We add a grid sizes css to our grid from player input
  grid.style.gridTemplateColumns = `repeat(${chosenBoardCols}, 3vmin)`;
  grid.style.gridTemplateRows = `repeat(${chosenBoardRows}, 3vmin)`;

  //iterate through our board model and create div elements for each cell
  //we will use r for rowindex, c for colIndex
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      let div = document.createElement("div");
      //set the id as rowIndex, colIndex, each cell now has a unique id
      div.setAttribute("id", `R${r}C${c}`);
      div.addEventListener("click", handleClick);
      grid.appendChild(div);
    }
  }

  //add random mines
  addMines();
  //add numbers corresponding to adjacent mines in board model
  addNumbers();
}

function addMines() {
  let minesToSet = chosenNumberOfMines;
  while (minesToSet > 0) {
    //Find random indexes
    const colIndex = Math.floor(Math.random() * chosenBoardCols);
    const rowIndex = Math.floor(Math.random() * chosenBoardRows);

    // if cell is not already a mine ('X'), set it to be 'X'
    if (board[rowIndex][colIndex] !== "X") {
      board[rowIndex][colIndex] = "X";
      minesToSet--;
      //this line belongs in the render function
      document.getElementById(`R${rowIndex}C${colIndex}`).innerHTML = "X";
    }
  }
}

function addNumbers() {
  //Add relevant numbers to all cells adjacent to mines
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      //If cell is a mine we do nothing
      if (board[r][c] === "X") {
        console.log("found mine");
      } else {
        //? BOUNDARY CHECKS
        //Check if current cell is in corner of board
        //top left
        if (r === 0 && c === 0) {
          mineNum = checkForMines(r, c, [5, 7, 8]);
          board[r][c] = mineNum;
          //this line should go to render() and function can be made more concise
          document.getElementById(`R${r}C${c}`).innerHTML = mineNum;
        }
        //top right
        else if (r === 0 && c === board[r].length - 1) {
          mineNum = checkForMines(r, c, [4, 6, 7]);
          board[r][c] = mineNum;
          //this line should go to render() and function can be made more concise
          document.getElementById(`R${r}C${c}`).innerHTML = mineNum;
        }
        //bottom left
        else if (r === board.length - 1 && c === 0) {
          mineNum = checkForMines(r, c, [2, 3, 5]);
          board[r][c] = mineNum;
          //this line should go to render() and function can be made more concise
          document.getElementById(`R${r}C${c}`).innerHTML = mineNum;
        }
        //bottom right
        else if (r === board.length - 1 && c === board[r].length - 1) {
          mineNum = checkForMines(r, c, [1, 2, 4]);
          board[r][c] = mineNum;
          //this line should go to render() and function can be made more concise
          document.getElementById(`R${r}C${c}`).innerHTML = mineNum;
        }
        //Check if current cell is at edge of board
        //N
        else if (r === 0) {
          mineNum = checkForMines(r, c, [4, 5, 6, 7, 8]);
          board[r][c] = mineNum;
          //this line should go to render() and function can be made more concise
          document.getElementById(`R${r}C${c}`).innerHTML = mineNum;
        }
        //E
        else if (c === board[r].length - 1) {
          mineNum = checkForMines(r, c, [1, 2, 4, 6, 7]);
          board[r][c] = mineNum;
          //this line should go to render() and function can be made more concise
          document.getElementById(`R${r}C${c}`).innerHTML = mineNum;
        }
        //S
        else if (r === board.length - 1) {
          mineNum = checkForMines(r, c, [1, 2, 3, 4, 5]);
          board[r][c] = mineNum;
          //this line should go to render() and function can be made more concise
          document.getElementById(`R${r}C${c}`).innerHTML = mineNum;
        }
        //W
        else if (c === 0) {
          mineNum = checkForMines(r, c, [2, 3, 5, 7, 8]);
          board[r][c] = mineNum;
          //this line should go to render() and function can be made more concise
          document.getElementById(`R${r}C${c}`).innerHTML = mineNum;
        }
        //cell in not located on grid border
        else {
          mineNum = checkForMines(r, c, [1, 2, 3, 4, 5, 6, 7, 8]);
          board[r][c] = mineNum;
          //this line should go to render() and function can be made more concise
          document.getElementById(`R${r}C${c}`).innerHTML = mineNum;
        }
      }
    }
  }
}

//This function checks for mines on board creation and assigns numbers to adjacent cells
//The checking array contains the adjacent cells we want to check eg
// 1 2 3
// 4   5
// 6 7 8
//We will use these values to access the corresponding function in our checkingMap object
function checkForMines(rowIndex, colIndex, checkingArray) {
  let adjMines = 0;
  for (const cell of checkingArray) {
    adjMines += checkMineMap[cell](rowIndex, colIndex);
  }
  return adjMines;
}

function render() {
  renderBoard();
}

function renderBoard() {}
//! EVENT LISTENERS

function handleClick() {
  //handleClick should only make changes to the board data model.
  //after, render() is called to visually update the grid

  render();
}
//! GAME
init();
console.log(board);
