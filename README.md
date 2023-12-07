<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- [![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url] -->

[![LinkedIn][linkedin-shield]][linkedin-url]

<div align="center">
<h1 align="center">Minesweeper 3D</h1>
  <p align="center">
    GA SEI Project 1
    <br />
    <br />
    <a href="https://j-o-phillips.github.io/ga-unit_1-minesweeper/">View Live Site</a>

  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#brief">Brief</a></li>
    <li><a href="#planning">Planning</a></li>
    <li><a href="#build-process">Build Process</a></li>
    <li><a href="#challenges-and-bugs">Challenges and Bugs</a></li>
    <li><a href="#key-takeaways">Key Takeaways</a></li>
    <li><a href="#future-improvements">Future Improvements</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
 
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://j-o-phillips.github.io/ga-unit_1-minesweeper/)

Timeframe: 1 week
Team: Solo

This was our Unit 1 project for the Software Engineering Immersive course at General Assembly: Build a Browser Game. There were a number of games to choose from, I chose minesweeper because the logic seemed like a challenge to implement. The technologies we were required to use were HTML, CSS, Javascript, and also Git/Github.

I worked individually on this project. The timeframe was 5 days.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- HTML
- CSS
- JavaScript
- Git/Github
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Installation

Clone the repo

```sh
   git clone https://github.com/j-o-phillips/ga-unit_1-minesweeper.git
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- BRIEF -->

## Brief

Build a browser game. Using only HTML, CSS and Javascript build a clone of one of a selection of existing games. The app must:

- Render a game in the browser
- Be built on a grid
- Design logic for winning
- Include separate HTML/CSS/Javascript files
- Use Javascript for DOM manipulation
- Be deployed online (github pages)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PLANNING -->

## Planning

The planning process:

- Decided on retro design theme and made a sketch of the front-end with excalidraw
- Sectioned out a js file with the parts of code I wanted to keep separate (I didn’t want changes to the underlying data model to affect the display, I wanted render functions to do this based on the changes to the model.).
- Considered how best to implement a data model of the minesweeper grid and decided to start with a 2d array.

[![Excalidraw Screen Shot][excal-screenshot]]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- BUILD PROCESS -->

## Build Process

To follow this process, it is best to skip the parts of the code that deal with 3d mode until they are covered later in this description.

** Stage 1: designing the board data array **

As mentioned, I wanted to use a 2d array for my data model. I created this 2d array with values that could be changed depending on user actions. I began by using numbers to denote adjacent mines and various letters if the cell contained a mine or was empty etc, however I quickly realised the limitations of this system and changed each array value to be an object of a Cell class which I created. I could now give each cell unlimited properties and they were easier to manipulate. Note: To solve the problems that inevitably occur at the board’s borders, I added in two extra columns and rows to my board model and set them to border = true, thus avoiding the type errors that occurred when non existent cells were being checked. CODE

```js
function init() {
  gameState = "active";
  //initialize board data model
  //We make the board 2 cols and 2 rows greater than player input, these will be 'borders'
  board = [];
  let cols = threeDMode ? threeDBoardCols : chosenBoardCols;
  let rows = threeDMode ? threeDBoardRows : chosenBoardRows;
  for (let r = 0; r < rows + 2; r++) {
    let boardRow = [];
    for (let c = 0; c < cols + 2; c++) {
      boardRow.push(new Cell(r, c, 0));
    }
    board.push(boardRow);
  }
  //Board data model created as 2d array. Console.log(board) lets you visualize the board as it is printed out
  //To access a cell use x,y index eg board[rowIndex][colIndex]
  createBoard();
  render();
}
```

I dynamically set the css properties of my board container to reflect the user’s desired number of columns and rows and appended a div to my html for every cell in my model. Each cell has a unique id based on the row and column index. Mines were added using random coord generators. The addNumbers function iterated over my data model (starting and index = 1 and finishing at length -1 to avoid the border cells), checked all adjacent cells for mines and set that number to the value property of my cell object.

```js
function addNumbers() {
  //Add relevant numbers to all cell values of cells adjacent to mines
  //We do not need to iterate over the borders so we start r and c at 1 and finish at length -1
  for (let r = 1; r < board.length - 1; r++) {
    for (let c = 1; c < board[r].length - 1; c++) {
      if (!board[r][c].isMine) {
        //Borderlink conditions for 3d mode, checks must 'loop' around
        //Borderlink at start
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
        //borderlink at end
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
        //Set our cell object value property to adjMines
        board[r][c].value = adjMines;
      }
    }
  }
}
```

** Stage 2: Rendering the board. **
My renderBoard function iterates over my 2d board array model and updates the display based on the properties of my cell objects. Because of this separation of concerns, I can add or remove properties to my cells or change what is rendered based on these values without affecting the other function.

** Stage 3: Revealing adjacent cells on user click **
Before 3d mode, this was the most challenging part of the code. Before I implemented the border cells, I was relying on checking whether a cell is in a corner, or on an edge and writing separate code for each of those multiple conditionals, but the border cells solved this. To briefly outline this function, it checks adjacent cells and if they are empty add them to a checklist array, which is then checked until that array is empty. The checked cells are flagged to avoid rechecking and their properties updated depending on their values. The render function then renders those changes to the board.

```js
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

    //handle borderlinks in 3d mode
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
        newCoords = checkAdjacentCell(x + 1, threeDBoardCols);
        if (newCoords) checkList.push(newCoords);
        newCoords = undefined;
        //W
        newCoords = checkAdjacentCell(x, threeDBoardCols);
        if (newCoords) checkList.push(newCoords);
        newCoords = undefined;
        //NW
        newCoords = checkAdjacentCell(x - 1, threeDBoardCols);
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
      //if no borderlinks ie not in 3d mode
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
```

After adding a simple checking function to check win/lose game states, the game was now functional.

** Stage 4: Career mode and local storage **
Because I could dynamically alter the size and number of mines in my board, it was fairly simple to implement a career mode that increased the difficulty of the game for each level. I added player scores based on an equation using the time taken to solve the puzzle and the number of mines to find, and added local storage so different users could load and save their current level and total score.

** Stage 5: 3d mode **
I found myself with a few days to spare with this project, so I wanted to see if it was possible to have the minesweeper board wrap around a three dimensional cube that the player could rotate. I knew how to create a cube using css transform: translate and rotate, so I first created this along with the rotation functions. I considered multiple approaches to ‘wrapping’ the grid around the cube, but decided to first handle the 4 sides ie. not the top or bottom, so that if i got stuck or ran out of time (which is indeed what happened!) this atleast would be functional. I extended the board array columns to four times their value from the player input (I would now have a rectangle wider than it is tall) and appended that to the various sides of the cube. The problem which became the biggest problem of this project was what to do when the beginning and end of the board model connects. I found I had to write separate cases for a lot of my functions that dealt with these borders (in the code I call them borderLinks), to implement functionality that would ‘wrap around’ the back of the cube to access the cells on the other side. Here are some of the extra checks in my checkAdjacent function that were necessary due to these borderLinks.

I decided not to implement the top and bottom of the cube during this project as the 4 sides had added much code, time and difficulty to my project, and essentially these 4 sides contained only 1 hard border to deal with (where the end of the board meets the start). The top and bottom faces would have to be separate grids and so would contain 4 borders each so will require more time to implement.

** Other notes: **
The game is fully functional without refreshing the page. I did this using by toggling the CSS display property of various HTML elements to allow me to toggle several different ‘screens’. By frequently using append and remove on those elements I am able to keep the data on each screen from interfering with each other, thus creating a sort of React App without using the React framework.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CHALLENGES AND BUGS -->

## Challenges and Bugs

There were three main challenges in this project. The first came when checking border cells and their adjacent cells. I would often get type errors because non existing cells outside of the board array were being checked. I first solved this problem by changing the method depending on whether a cell was in a corner or on an edge of the board model, but this was a lot of unnecessary code. Eventually I came up with the better solution of using an extra row or column on each side of the array to denote border cells.

The second problem was the checkAllAdjacent function that revealed adjacent cells. There were several instances of cells that had already been checked being rechecked, and the working out the coordinates of adjacent cells was just generally confusing. Moving the unchecked cells to a checklist array and refactoring the code to use a second checkAdjacentCell function cleaned up the code and made it easier to understand.

The third challenge was how to handle the borders at the beginning of and end of my board model in 3d mode, ie, where the end of the array meets the start and needs to link seamlessly. This required writing a lot of new branches in the code for these particular circumstances and again, working out the coordinates of those cells that ‘wrap around’ from the back to the front of the array was confusing at first.

### Bugs

Occasionally the game will look slightly different on different browsers, but as I didn’t finish making the game responsive this is to be expected.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Key Takeaways -->

## Key Takeaways

### React-three-fiber

I set out to recreate a visually authentic version of minesweeper and I am mostly happy with the visual accuracy of the game. I read a bit about different recursive algorithms to use for revealing adjacent cells, but I’m proud of the fact that I managed to come up with my own solution, which was good enough to be adapted into a 3d game mode. I was also pleased with the way I solved the border problem by adding an extra column and row to denote border cells.

These were my key takeaways for this project:

- **Gained confidence using Git and Github**
- **Find the best solutions to simple problems first, so that you can build on this and add complexity later**
- **Reinforced my knowledge of JS basics**
- **Learned how to structure code to make it managable by seperating concerns**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FUTURE IMPORVEMENTS -->

## Future Improvements

- The most pressing improvement would be to make the game responsive to different screen sizes.
- I would also like to add a top and a bottom face to the cube in 3d mode.
- I would like to expand career mode and alter the score calculating functions to make the game more of a challenge but also more balanced.
- Eventually, I would like to use three.js to make a truly 3d version of a minesweeper cube with blocks inside the cube instead of just on the faces.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Jake Phillips - jphillips@gmail.com

Portfolio Link: [Portfolio](https://github.com/jake-o-phillips/spaceacademy-backend)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/jake-o-phillips/spaceacademy-backend.svg?style=for-the-badge
[contributors-url]: https://github.com/j-o-phillips/spaceacademy-backend/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/j-o-phillips/spaceacademy-backend.svg?style=for-the-badge
[forks-url]: https://github.com/j-o-phillips/spaceacademy-backend/network/members
[stars-shield]: https://img.shields.io/github/stars/jake-o-phillips/spaceacademy-backend/.svg?style=for-the-badge
[stars-url]: https://github.com/j-o-phillips/spaceacademy-backend/stargazers
[issues-shield]: https://img.shields.io/github/issues/spaceacademy-backend/spaceacademy-backend.svg?style=for-the-badge
[issues-url]: https://github.com/j-o-phillips/spaceacademy-backend/issues
[license-shield]: https://img.shields.io/github/license/spaceacademy-backend/spaceacademy-backend.svg?style=for-the-badge
[license-url]: https://github.com/j-o-phillips/spaceacademy-backend/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/jake-phillips-developer/
[product-screenshot]: assets/readme/game.png
[excal-screenshot]: assets/readme/Excal.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
