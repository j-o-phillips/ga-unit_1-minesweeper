//! CONSTANTS

const chosenBoardCols = 10;
const chosenBoardRows = 10;

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
