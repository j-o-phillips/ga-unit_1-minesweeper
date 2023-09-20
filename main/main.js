//! CACHED ELEMENTS

const container = document.getElementById("container");
const grid = document.getElementById("grid");
const face = document.getElementById("face-box");
const mineDisplay = document.getElementById("mine-display");
const timeDisplay = document.getElementById("time-display");
const rowInput = document.getElementById("row");
const colInput = document.getElementById("col");
const mineInput = document.getElementById("mine");
const customGame = document.getElementById("custom-start");
const menuContainer = document.getElementById("menu-container");
const gameContainer = document.getElementById("game-container");
const backToMenu = document.getElementById("back-to-menu");
const threeDBackToMenu = document.getElementById("threeD-back-to-menu");
const careerGame = document.getElementById("career-start");
const detailsContainer = document.getElementById("details-container");
const userName = document.getElementById("user");
const custom3dGame = document.getElementById("custom-3d-start");

//Cube faces
const threeDGameContainer = document.getElementById("threeD-game-container");
const cubeContainer = document.getElementById("cube-container");
const cubeFront = document.getElementById("cube-front");
const cubeRight = document.getElementById("cube-right");
const cubeBack = document.getElementById("cube-back");
const cubeLeft = document.getElementById("cube-left");
const cubeTop = document.getElementById("cube-top");
const cubeBottom = document.getElementById("cube-bottom");

//! CONSTANTS

//Cell class
class Cell {
  constructor(rowIndex, colIndex, value) {
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.isMine = false;
    this.isFlagged = false;
    this.value = value;
    this.isBorder = false;
    this.isChecked = false;
    this.borderLink = null;
  }
}

const playerObj = {
  totalScore: 0,
  careerLevel: 1,
};

//! STATE VARIABLES

//Player inputs
let user;
let threeDMode = false;
let cubeSize;
let chosenBoardCols = 20;
let chosenBoardRows = 20;
let threeDBoardRows = 20;
let threeDBoardCols = 20 * 4;
let chosenNumberOfMines = 30;

let board; //2d array board data model
let gameState; //active, win, lose
let cellsToClear;
let flagsLeft;
let timerActive = false;
let time = 0;
let careerModeActive = false;

//! FUNCTIONS

function init() {
  gameState = "active";
  //initialize board data model
  //We make the board 2 cols and 2 rows greater than player input, these will be 'borders'
  board = [];
  if (!threeDMode) {
    for (let r = 0; r < chosenBoardRows + 2; r++) {
      let boardRow = [];
      for (let c = 0; c < chosenBoardCols + 2; c++) {
        boardRow.push(new Cell(r, c, 0));
      }
      board.push(boardRow);
    }
  }
  if (threeDMode) {
    for (let r = 0; r < threeDBoardRows + 2; r++) {
      let boardRow = [];
      for (let c = 0; c < threeDBoardCols + 2; c++) {
        boardRow.push(new Cell(r, c, 0));
      }
      board.push(boardRow);
    }
  }
  //Board data model created as 2d array. Console.log(board) lets you visualize the board as it is printed out
  //To access a cell use x,y index eg board[rowIndex][colIndex]

  setCSSProperties();
  createBoard();
  render();
}

function setCSSProperties() {}

function createBoard() {
  //We add a grid sizes css to our grid from player input
  if (!threeDMode) {
    grid.style.gridTemplateColumns = `repeat(${chosenBoardCols}, 2.3vmin)`;
    grid.style.gridTemplateRows = `repeat(${chosenBoardRows}, 2.3vmin)`;
  }
  if (threeDMode) {
    //! PLACEHOLDER
    chosenBoardCols = 20;
    chosenBoardRows = 20;
    cubeFront.style.gridTemplateColumns = `repeat(${chosenBoardCols}, 20px)`;
    cubeFront.style.gridTemplateRows = `repeat(${chosenBoardRows}, 20px)`;

    cubeRight.style.gridTemplateColumns = `repeat(${chosenBoardCols}, 20px)`;
    cubeRight.style.gridTemplateRows = `repeat(${chosenBoardRows}, 20px)`;

    cubeBack.style.gridTemplateColumns = `repeat(${chosenBoardCols}, 20px)`;
    cubeBack.style.gridTemplateRows = `repeat(${chosenBoardRows}, 20px)`;

    cubeLeft.style.gridTemplateColumns = `repeat(${chosenBoardCols}, 20px)`;
    cubeLeft.style.gridTemplateRows = `repeat(${chosenBoardRows}, 20px)`;

    cubeTop.style.gridTemplateColumns = `repeat(${chosenBoardCols}, 20px)`;
    cubeTop.style.gridTemplateRows = `repeat(${chosenBoardRows}, 20px)`;

    cubeBottom.style.gridTemplateColumns = `repeat(${chosenBoardCols}, 20px)`;
    cubeBottom.style.gridTemplateRows = `repeat(${chosenBoardRows}, 20px)`;
  }

  //iterate through our board model and create div elements for each cell
  //we will use r for rowindex, c for colIndex
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (!threeDMode) {
        //if the cell is on the edge of our grid, we set the isBorder property to true
        if (
          r === 0 ||
          r === board.length - 1 ||
          c === 0 ||
          c === board[r].length - 1
        ) {
          board[r][c].isBorder = true;
        } else {
          let div = document.createElement("div");
          //set the id as rowIndex, colIndex, each cell now has a unique id
          div.setAttribute("id", `R${r}C${c}`);
          div.setAttribute("data-row", r);
          div.setAttribute("data-col", c);
          //NOTE: We toggle our handleClick event listener in render()
          div.addEventListener("contextmenu", handleRightClick);
          grid.appendChild(div);
        }
      }
      //!Note: now that we have added an 'invisible' border, our cell indexes will start at 1 and finish at
      //! .length -1, not 0 and .length

      if (threeDMode) {
        if (r === 0 || r === board.length - 1) {
          board[r][c].isBorder = true;
        } else if (c === 0 || c === board[r].length - 1) {
          board[r][c].isBorder = true;
          board[r][c].borderLink = [r, c];
        } else {
          let div = document.createElement("div");
          //set the id as rowIndex, colIndex, each cell now has a unique id
          div.setAttribute("id", `R${r}C${c}`);
          div.setAttribute("data-row", r);
          div.setAttribute("data-col", c);
          //NOTE: We toggle our handleClick event listener in render()
          div.addEventListener("contextmenu", handleRightClick);
          if (c >= 1 && c <= threeDBoardRows) cubeFront.appendChild(div);
          if (c >= threeDBoardRows + 1 && c <= threeDBoardRows * 2)
            cubeRight.appendChild(div);
          if (c >= threeDBoardRows * 2 + 1 && c <= threeDBoardRows * 3)
            cubeBack.appendChild(div);
          if (c >= threeDBoardRows * 3 + 1 && c <= threeDBoardRows * 4)
            cubeLeft.appendChild(div);
        }
      }
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
    let colIndex;
    let rowIndex;
    //Find random indexes
    if (!threeDMode) {
      colIndex = Math.floor(Math.random() * chosenBoardCols);
      rowIndex = Math.floor(Math.random() * chosenBoardRows);
    }

    if (threeDMode) {
      colIndex = Math.floor(Math.random() * threeDBoardCols);
      rowIndex = Math.floor(Math.random() * chosenBoardRows);
    }

    // if cell is not already a mine , and is not a border cell , set it to be a mine
    if (
      board[rowIndex][colIndex].isMine === false &&
      board[rowIndex][colIndex].isBorder !== true
    ) {
      board[rowIndex][colIndex].isMine = true;
      minesToSet--;
    }
  }
}

function addNumbers() {
  //Add relevant numbers to all cell values of cells adjacent to mines
  //We do not need to iterate over the borders so we start r and c at 1 and finish at length -1
  for (let r = 1; r < board.length - 1; r++) {
    for (let c = 1; c < board[r].length - 1; c++) {
      if (board[r][c].isMine === true) {
        console.log("found mine");
      } else {
        //Border at start
        let adjMines = 0;
        if (board[r - 1][c - 1].borderLink) {
          if (board[r - 1][board[r].length - 1].isMine === true) adjMines++;
        }

        if (board[r][c - 1].borderLink) {
          if (board[r][board[r].length - 1].isMine === true) adjMines++;
        }

        if (board[r + 1][c - 1].borderLink) {
          if (board[r + 1][board[r].length - 1].isMine === true) adjMines++;
        }

        //border at end
        if (board[r - 1][c + 1].borderLink) {
          if (board[r - 1][1].isMine === true) adjMines++;
        }

        if (board[r][c + 1].borderLink) {
          if (board[r][1].isMine === true) adjMines++;
        }

        if (board[r + 1][c + 1].borderLink) {
          if (board[r + 1][1].isMine === true) adjMines++;
        }

        if (board[r - 1][c - 1].isMine === true) adjMines++;
        if (board[r - 1][c].isMine === true) adjMines++;
        if (board[r - 1][c + 1].isMine === true) adjMines++;
        if (board[r][c - 1].isMine === true) adjMines++;
        if (board[r][c + 1].isMine === true) adjMines++;
        if (board[r + 1][c - 1].isMine === true) adjMines++;
        if (board[r + 1][c].isMine === true) adjMines++;
        if (board[r + 1][c + 1].isMine === true) adjMines++;
        board[r][c].value = adjMines;
      }
    }
  }
}

function checkAllAdjacent(r, c) {
  //This will be our list of cells to check
  let checkList = [[r, c]];

  //Set already checked cells isChecked = true to avoid rechecking
  board[r][c].isChecked = true;

  while (checkList.length > 0) {
    //get current coords from first value in checklist
    let x = checkList[0][0];
    let y = checkList[0][1];
    //delete it from checklist once we have the coords
    checkList.shift();
    //checkAdjacentCell is called for each cell adjacent to the current cell being checked
    //it completes its method and if the cell.value = 0, ie, there are no adj mines, it will return that cells coords,
    //we can then push those coords to our checklist to be checked next
    let newCoords;

    //handle edges in 3d mode
    if ((threeDMode && y === 1) || y === threeDBoardCols) {
      if (y === 1) {
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
        newCoords = checkAdjacentCell(x + 1, 40);
        if (newCoords) checkList.push(newCoords);
        newCoords = undefined;
        //W
        newCoords = checkAdjacentCell(x, 40);
        if (newCoords) checkList.push(newCoords);
        newCoords = undefined;
        //NW
        newCoords = checkAdjacentCell(x - 1, 40);
        if (newCoords) checkList.push(newCoords);
        newCoords = undefined;
      }
      if (y === threeDBoardCols) {
        console.log("end edge");
        //N
        newCoords = checkAdjacentCell(x - 1, y);
        if (newCoords) checkList.push(newCoords);
        newCoords = undefined;
        //NE
        newCoords = checkAdjacentCell(x - 1, 1);
        if (newCoords) checkList.push(newCoords);
        newCoords = undefined;
        //E
        newCoords = checkAdjacentCell(x, 1);
        if (newCoords) checkList.push(newCoords);
        newCoords = undefined;
        //SE
        newCoords = checkAdjacentCell(x + 1, 1);
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
    } else {
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
}

function checkAdjacentCell(cellXOffset, cellYOffset) {
  if (
    board[cellXOffset][cellYOffset].isBorder === true ||
    board[cellXOffset][cellYOffset].isChecked === true
  ) {
    //Empty for now but needed for 3d minesweeper!
  } else {
    if (board[cellXOffset][cellYOffset].value !== 0) {
      board[cellXOffset][cellYOffset].isChecked = true;
    } else {
      board[cellXOffset][cellYOffset].isChecked = true;
      return [cellXOffset, cellYOffset];
    }
  }
}
function render() {
  renderHeader();
  renderBoard();
}

function renderHeader() {
  mineDisplay.innerHTML = ("00" + flagsLeft).slice(-3);
  timeDisplay.innerHTML = ("00" + time).slice(-3);
}

function renderBoard() {
  //iterate over our board model, ignore border rows and cols
  for (let r = 1; r < board.length - 1; r++) {
    for (let c = 1; c < board[r].length - 1; c++) {
      const cell = document.getElementById(`R${r}C${c}`);
      //If cell has been checked
      if (board[r][c].isChecked === true) {
        cell.style.border = "1px solid rgb(72, 72, 72)";
      }

      //If cell is flagged
      if (board[r][c].isFlagged === true) {
        cell.innerHTML = "F";
        cell.removeEventListener("click", handleClick);
      }
      if (board[r][c].isFlagged === false) {
        cell.innerHTML = "";
        cell.addEventListener("click", handleClick);
      }
      //If cell.value is number greater than 0 ie has adj mines
      if (board[r][c].value !== 0 && board[r][c].isChecked === true) {
        cell.innerText = board[r][c].value;
        cell.style.border = "1px solid rgb(72, 72, 72)";
        switch (board[r][c].value) {
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
      //If game is lost
      if (gameState === "lose") {
        if (board[r][c].isMine === true) {
          cell.innerHTML = "!";
          cell.style.backgroundColor = "red";
          cell.style.border = "1px solid rgb(72, 72, 72)";
          stopTimer();
        }
      }
    }
  }
}

function renderPlayerDetails(level, score, totalScore) {
  //Append player details to html
  document.getElementById("career-level").innerHTML = `LEVEL: ${level}`;
  document.getElementById("player-score").innerHTML = `SCORE: ${score}`;

  document.getElementById(
    "player-total-score"
  ).innerHTML = `TOTAL SCORE: ${totalScore}`;
}

function checkWinConditions() {
  let checkedCells = 0;
  for (let r = 1; r < board.length - 1; r++) {
    for (let c = 1; c < board[r].length - 1; c++) {
      if (board[r][c].isChecked === true) {
        checkedCells++;
      }
    }
  }

  if (gameState === "active") {
    if (cellsToClear === checkedCells) {
      gameState = "win";
      stopTimer();
      console.log("won");
      //handle career progression
      if (careerModeActive) {
        console.log(chosenNumberOfMines);
        console.log(time);
        let score = Math.floor((chosenNumberOfMines * 1000) / time);
        console.log(score);
        playerObj.totalScore += score;

        renderPlayerDetails(playerObj.careerLevel, score, playerObj.totalScore);
        playerObj.careerLevel++;
        if (localStorage) {
          localStorage.setItem(user, JSON.stringify(playerObj));
          console.log("data saved");
        } else alert("No access to local storage");
      }
    }
  }
}

function checkFlags() {
  flagsLeft = chosenNumberOfMines;
  for (let r = 1; r < board.length - 1; r++) {
    for (let c = 1; c < board[r].length - 1; c++) {
      if (board[r][c].isFlagged === true) flagsLeft--;
    }
  }
}

//Timing functions
let timer;
function startTimer() {
  if (!timerActive) {
    timer = setInterval(() => {
      time++;
      renderHeader();
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(timer);
}

//! EVENT LISTENERS

face.addEventListener("click", handleRestart);
customGame.addEventListener("click", handleCustomStart);
backToMenu.addEventListener("click", handleBackToMenu);
threeDBackToMenu.addEventListener("click", handleBackToMenu);
careerGame.addEventListener("click", handleCareerStart);
custom3dGame.addEventListener("click", handleCustom3DStart);

function handleCareerStart() {
  //Set user to player input
  user = userName.value;
  console.log(user);
  //Add player detail html elemnts
  const careerLevelDiv = document.createElement("div");
  careerLevelDiv.setAttribute("id", "career-level");
  detailsContainer.appendChild(careerLevelDiv);

  const playerScoreDiv = document.createElement("div");
  playerScoreDiv.setAttribute("id", "player-score");
  detailsContainer.appendChild(playerScoreDiv);

  const playerTotalScore = document.createElement("div");
  playerTotalScore.setAttribute("id", "player-total-score");
  detailsContainer.appendChild(playerTotalScore);

  //Load data if present
  careerModeActive = true;
  let loaded = JSON.parse(localStorage.getItem(user));
  if (loaded) {
    playerObj.careerLevel = loaded.careerLevel;
    playerObj.totalScore = loaded.totalScore;
    console.log(loaded);
  } else {
    playerObj.careerLevel = 1;
    playerObj.totalScore = 0;
  }

  //clear html grid
  while (grid.hasChildNodes()) {
    grid.removeChild(grid.firstChild);
  }
  renderPlayerDetails(playerObj.careerLevel, 0, playerObj.totalScore);

  chosenBoardRows = 10 + playerObj.careerLevel * 2;
  chosenBoardCols = 10 + playerObj.careerLevel * 4;
  // chosenNumberOfMines = Math.floor(
  //   chosenBoardRows * chosenBoardCols * (0.1 + playerObj.careerLevel / 100)
  // );
  chosenNumberOfMines = 4;
  flagsLeft = chosenNumberOfMines;
  cellsToClear = chosenBoardCols * chosenBoardRows - chosenNumberOfMines;
  console.log(chosenNumberOfMines);
  menuContainer.style.display = "none";
  gameContainer.style.display = "flex";

  init();
}

function handleBackToMenu() {
  careerModeActive = false;
  threeDMode = false;
  menuContainer.style.display = "flex";
  gameContainer.style.display = "none";
  threeDGameContainer.style.display = "none";

  while (detailsContainer.hasChildNodes()) {
    detailsContainer.removeChild(detailsContainer.firstChild);
  }

  while (grid.hasChildNodes()) {
    grid.removeChild(grid.firstChild);
  }

  while (cubeFront.hasChildNodes()) {
    cubeFront.removeChild(cubeFront.firstChild);
  }
  while (cubeRight.hasChildNodes()) {
    cubeRight.removeChild(cubeRight.firstChild);
  }
  while (cubeBack.hasChildNodes()) {
    cubeBack.removeChild(cubeBack.firstChild);
  }
  while (cubeLeft.hasChildNodes()) {
    cubeLeft.removeChild(cubeLeft.firstChild);
  }
  while (cubeTop.hasChildNodes()) {
    cubeTop.removeChild(cubeTop.firstChild);
  }
  while (cubeBottom.hasChildNodes()) {
    cubeBottom.removeChild(cubeBottom.firstChild);
  }
}

function handleCustomStart() {
  while (grid.hasChildNodes()) {
    grid.removeChild(grid.firstChild);
  }
  //! Add some validation
  chosenBoardRows = Number(rowInput.value);
  chosenBoardCols = Number(colInput.value);
  chosenNumberOfMines = Number(mineInput.value);
  flagsLeft = chosenNumberOfMines;
  cellsToClear = chosenBoardCols * chosenBoardRows - chosenNumberOfMines;

  menuContainer.style.display = "none";
  gameContainer.style.display = "flex";

  init();
}

function handleCustom3DStart() {
  threeDMode = true;
  menuContainer.style.display = "none";
  threeDGameContainer.style.display = "flex";
  chosenNumberOfMines = Number(mineInput.value);
  flagsLeft = chosenNumberOfMines;
  cellsToClear = chosenBoardCols * chosenBoardRows - chosenNumberOfMines;

  init();
}

function handleClick(e) {
  //handleClick should only make changes to the board data model.
  //after, render() is called to visually update the grid

  //Start timer
  if (!timerActive) {
    startTimer();
    timerActive = true;
  }

  //These values come from my div id's eg R5C8
  const clickedRowIndex = Number(e.target.dataset.row);
  const clickedColIndex = Number(e.target.dataset.col);

  if (gameState === "active") {
    if (board[clickedRowIndex][clickedColIndex].isMine === true) {
      //check if cell is a mine, if so end the game
      gameState = "lose";
    } else {
      //check if cell contains number that is not 0, ie, is adjacent to atleast 1 mine;
      if (board[clickedRowIndex][clickedColIndex].value !== 0) {
        board[clickedRowIndex][clickedColIndex].isChecked = true;
      }
      //if cell is empty call checkAllAdjacent to check adjacent cells
      if (board[clickedRowIndex][clickedColIndex].value === 0) {
        checkAllAdjacent(clickedRowIndex, clickedColIndex);
      }
    }
    //once changes have been made to the board model, call render to render the changes
    render();
    checkWinConditions();
  }
}
function handleRightClick(e) {
  e.preventDefault();
  //start timer
  if (!timerActive) {
    timerActive = true;
    startTimer();
  }

  const clickedRowIndex = Number(e.target.dataset.row);
  const clickedColIndex = Number(e.target.dataset.col);

  //Toggle flag
  if (gameState === "active") {
    if (board[clickedRowIndex][clickedColIndex].isChecked === false) {
      if (board[clickedRowIndex][clickedColIndex].isFlagged === false) {
        board[clickedRowIndex][clickedColIndex].isFlagged = true;
      } else {
        board[clickedRowIndex][clickedColIndex].isFlagged = false;
      }
    }
  }
  checkFlags();
  render();
}

function handleRestart() {
  //Remove all divs from html grid
  while (grid.hasChildNodes()) {
    grid.removeChild(grid.firstChild);
  }
  flagsLeft = chosenNumberOfMines;
  stopTimer();
  timerActive = false;
  time = 0;
  init();
}

//! CUBE CODE

const cube = document.getElementById("cube");

const buttonFront = document.getElementById("front");
buttonFront.addEventListener("click", () => {
  cube.className = "cube show-front";
});

const buttonRight = document.getElementById("right");
buttonRight.addEventListener("click", () => {
  cube.className = "cube show-right";
});

const buttonBack = document.getElementById("back");
buttonBack.addEventListener("click", () => {
  cube.className = "cube show-back";
});

const buttonLeft = document.getElementById("left");
buttonLeft.addEventListener("click", () => {
  cube.className = "cube show-left";
});

const buttonTop = document.getElementById("top");
buttonTop.addEventListener("click", () => {
  cube.className = "cube show-top";
});

const buttonBottom = document.getElementById("bottom");
buttonBottom.addEventListener("click", () => {
  cube.className = "cube show-bottom";
});
