/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */


 const HEIGHT = 6;
 const WIDTH = 7;
 //starts game on form submition

function handleStartGameForm(evt){
  evt.preventDefault();

  let color1 = inputs.elements[0].value;
  let color2 = inputs.elements[1].value;

  //set default colors
  if (!validTextColor(color1)) {
    color1 = "red";
  }
  if (!validTextColor(color2)) {
    color2 = "blue";
  }

  //creates player objects from Player class
  let player1 = new Player(color1, "1");
  let player2 = new Player(color2, "2");

  let players = [player1, player2];
  startGame(players);
}

function startGame(players) {
  new Game(HEIGHT, WIDTH, players);
}


class Game {
  constructor(height, width, players) {
    this.players = players;
    this.board = [];
    this.height = height;
    this.width = width;
    this.currPlayer = players[0];

    this.handleClick = this.handleClick.bind(this);
    

    this.deleteGameBoard();
    this.makeBoard();
    this.makeHtmlBoard();
  }

  deleteGameBoard(){
    let htmlBoard = document.getElementById("board");
    htmlBoard.innerHTML = "";
  }

 

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const htmlBoard = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick);


    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    htmlBoard.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    // piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);
    piece.style.backgroundColor = this.currPlayer.color;

    // console.log(piece, this.currPlayer, piece.style)

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    setTimeout(function(){alert(msg);}, 100);
  }

  
  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.name;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.name} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer.name === players[0].name ? players[1] : players[0];
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    let game = this;
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < game.height &&
          x >= 0 &&
          x < game.width &&
          game.board[y][x] === game.currPlayer.name
      );
    }

    for (let y = 0; y < game.height; y++) {
      for (let x = 0; x < game.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to winx
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          document.getElementById("column-top").removeEventListener("click", this.handleClick);
          return true;
        }
      }
    }
  }

}

class Player {
  constructor(color, name) {
    this.color = color;
    this.name = name;
  }
}


// thank you based stack overflow
// https://stackoverflow.com/questions/6386090/validating-css-color-names
function validTextColor(stringToTest) {
  //Alter the following conditions according to your need.
  if (stringToTest === "") { return false; }
  if (stringToTest === "inherit") { return false; }
  if (stringToTest === "transparent") { return false; }

  var image = document.createElement("img");
  image.style.color = "rgb(0, 0, 0)";
  image.style.color = stringToTest;
  if (image.style.color !== "rgb(0, 0, 0)") { return true; }
  image.style.color = "rgb(255, 255, 255)";
  image.style.color = stringToTest;
  return image.style.color !== "rgb(255, 255, 255)";
}

document.getElementById("start-game").addEventListener("click", handleStartGameForm);






