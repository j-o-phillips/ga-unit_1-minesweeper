//! CONSTANTS

const chosenBoardCols = 20;
const chosenBoardRows = 20;
const chosenNumberOfMines = 40;

//! STATE VARIABLES

let board; //2d array board data model
let gameState; //null if still playing, 1 if board revealed, -1 if mine hit

//! CACHED ELEMENTS

const container = document.getElementById("container");
const grid = document.getElementById("grid");
const face = document.getElementById("face-box");

//! FUNCTIONS

function init() {
  face.addEventListener("click", handleRefresh);
  gameState = "active";
  //initialize board data model
  //We make the board 2 cols and 2 rows greater than player input, these will be 'borders'
  board = [];
  for (let i = 0; i < chosenBoardRows + 2; i++) {
    let boardRow = [];
    for (let i = 0; i < chosenBoardCols + 2; i++) {
      boardRow.push(0);
    }
    board.push(boardRow);
  }
  //Board data model created as 2d array. Console.log(board) lets you visualize the board as it is printed out
  //To access a cell use x,y index eg board[rowIndex][colIndex]

  createBoard();
  render();
}

function createBoard() {
  //We add a grid sizes css to our grid from player input
  grid.style.gridTemplateColumns = `repeat(${chosenBoardCols}, 2.3vmin)`;
  grid.style.gridTemplateRows = `repeat(${chosenBoardRows}, 2.3vmin)`;

  //iterate through our board model and create div elements for each cell
  //we will use r for rowindex, c for colIndex
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      //if the cell is on the edge of our grid, we assign it 'B' for border
      if (
        r === 0 ||
        r === board.length - 1 ||
        c === 0 ||
        c === board[r].length - 1
      ) {
        board[r][c] = "B";
      } else {
        let div = document.createElement("div");
        //set the id as rowIndex, colIndex, each cell now has a unique id
        div.setAttribute("id", `R${r}C${c}`);
        div.setAttribute("data-row", r);
        div.setAttribute("data-col", c);
        div.addEventListener("click", handleClick);
        div.addEventListener("contextmenu", handleRightClick);
        grid.appendChild(div);
      }
    }
    //!Note: now that we have added an 'invisible' border, our cell indexes will start at 1 and finish at
    //! .length -1, not 0 and .length
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

    // if cell is not already a mine ('X'), and is not a border cell ('B'), set it to be 'X'
    if (
      board[rowIndex][colIndex] !== "X" &&
      board[rowIndex][colIndex] !== "B"
    ) {
      board[rowIndex][colIndex] = "X";
      minesToSet--;
    }
  }
}

function addNumbers() {
  //Add relevant numbers to all cells adjacent to mines
  //We do not need to iterate over the borders so we start r and c at 1 and finish at length -1
  for (let r = 1; r < board.length - 1; r++) {
    for (let c = 1; c < board[r].length - 1; c++) {
      if (board[r][c] === "X") {
        console.log("found border or mine");
      } else {
        let adjMines = 0;
        if (board[r - 1][c - 1] === "X") adjMines++;
        if (board[r - 1][c] === "X") adjMines++;
        if (board[r - 1][c + 1] === "X") adjMines++;
        if (board[r][c - 1] === "X") adjMines++;
        if (board[r][c + 1] === "X") adjMines++;
        if (board[r + 1][c - 1] === "X") adjMines++;
        if (board[r + 1][c] === "X") adjMines++;
        if (board[r + 1][c + 1] === "X") adjMines++;
        board[r][c] = -adjMines;
      }
    }
  }
}

function checkAllAdjacent(r, c) {
  //This will be our list of cells to check
  let checkList = [[r, c]];

  //Set already checked cells to 'C', to avoid rechecking
  board[r][c] = "C";

  while (checkList.length > 0) {
    //get current coords from first value in checklist
    let x = checkList[0][0];
    let y = checkList[0][1];
    //delete it from checklist once we have the coords
    checkList.shift();
    //checkAdjacentCell is called for each cell adjacent to the current cell being checked
    //it completes its method and if the cell is '0', it will return that cells coords,
    //we can then push those coords to our checklist to be checked next
    let newCoords;
    //N
    newCoords = checkAdjacentCell(x - 1, y);
    if (newCoords) checkList.push(newCoords);
    newCoords = undefined;

    //NE
    newCoords = checkAdjacentCell(x - 1, y + 1);
    if (newCoords) checkList.push(newCoords);
    newCoords = undefined;

    //E
    newCoords = checkAdjacentCell(x, y + 1);
    if (newCoords) checkList.push(newCoords);
    newCoords = undefined;

    //SE
    newCoords = checkAdjacentCell(x + 1, y + 1);
    if (newCoords) checkList.push(newCoords);
    newCoords = undefined;

    //S
    newCoords = checkAdjacentCell(x + 1, y);
    if (newCoords) checkList.push(newCoords);
    newCoords = undefined;

    //SW
    newCoords = checkAdjacentCell(x + 1, y - 1);
    if (newCoords) checkList.push(newCoords);
    newCoords = undefined;

    //W
    newCoords = checkAdjacentCell(x, y - 1);
    if (newCoords) checkList.push(newCoords);
    newCoords = undefined;

    //NW
    newCoords = checkAdjacentCell(x - 1, y - 1);
    if (newCoords) checkList.push(newCoords);
    newCoords = undefined;
  }
}

function checkAdjacentCell(cellXOffset, cellYOffset) {
  if (
    board[cellXOffset][cellYOffset] === "B" ||
    board[cellXOffset][cellYOffset] === "C"
  ) {
    //Empty for now but needed for 3d minesweeper!
  } else {
    if (board[cellXOffset][cellYOffset] !== 0) {
      board[cellXOffset][cellYOffset] = Math.abs(
        board[cellXOffset][cellYOffset]
      );
    } else {
      board[cellXOffset][cellYOffset] = "C";
      return [cellXOffset, cellYOffset];
    }
  }
}
function render() {
  renderBoard();
}

function renderBoard() {
  //iterate over our board model, ignore border rows and cols ('B')
  for (let r = 1; r < board.length - 1; r++) {
    for (let c = 1; c < board[r].length - 1; c++) {
      const cell = document.getElementById(`R${r}C${c}`);
      //If cell has been checked
      if (board[r][c] === "C") {
        cell.style.border = "1px solid rgb(72, 72, 72)";
      }
      //If cell is number
      if (board[r][c] > 0) {
        cell.innerHTML = board[r][c];
        cell.style.border = "1px solid rgb(72, 72, 72)";
        switch (board[r][c]) {
          case 1:
            cell.style.color = "blue";
            break;
          case 2:
            cell.style.color = "green";
            break;
          case 3:
            cell.style.color = "red";
            break;
          case 4:
            cell.style.color = "purple";
            break;
          case 5:
            cell.style.color = "maroon";
            break;
          case 6:
            cell.style.color = "turquoise";
            break;
          case 7:
            cell.style.color = "black";
            break;
        }
      }
      if (board[r][c] === "!") {
        cell.innerHTML = board[r][c];
      }
      if (gameState === "lose") {
        if (board[r][c] === "X") {
          cell.innerHTML = board[r][c];
          cell.style.backgroundColor = "red";
        }
      }
    }
  }
}

//! EVENT LISTENERS

function handleClick(e) {
  //handleClick should only make changes to the board data model.
  //after, render() is called to visually update the grid

  //These values come from my div id's eg R5C8
  const clickedRowIndex = Number(e.target.dataset.row);
  const clickedColIndex = Number(e.target.dataset.col);

  if (gameState === "active") {
    if (board[clickedRowIndex][clickedColIndex] === "X") {
      //check if cell is a mine, if so end the game
      gameState = "lose";
      //!LAZY
      document.getElementById(
        `R${clickedRowIndex}C${clickedColIndex}`
      ).innerHTML = board[clickedRowIndex][clickedColIndex];
      document.getElementById(
        `R${clickedRowIndex}C${clickedColIndex}`
      ).style.backgroundColor = "red";
    }
    //check if cell contains number that is not 0, ie, is adjacent to atleast 1 mine;
    if (board[clickedRowIndex][clickedColIndex] !== 0) {
      board[clickedRowIndex][clickedColIndex] = Math.abs(
        board[clickedRowIndex][clickedColIndex]
      );
    }
    //if cell is empty call checkAllAdjacent to check adjacent cells
    if (board[clickedRowIndex][clickedColIndex] === 0) {
      checkAllAdjacent(clickedRowIndex, clickedColIndex);
    }
    //once changes have been made to the board model, call render to render the changes
    render();
  }
}
function handleRightClick(e) {
  e.preventDefault();
  const clickedRowIndex = Number(e.target.dataset.row);
  const clickedColIndex = Number(e.target.dataset.col);
  const cell = document.getElementById(
    `R${clickedRowIndex}C${clickedColIndex}`
  );
  //Toggle flag
  if (board[clickedRowIndex][clickedColIndex] !== "C") {
    cell.innerHTML = "F";
  }
}

function handleRefresh() {
  console.log("refresh");
}

//! GAME

init();

document.querySelector("button").addEventListener("click", () => {
  console.log(board);
});
