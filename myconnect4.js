/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

 class Game {
    constructor(color1 = 'red', color2 = 'blue', height = 6, width = 6){
      this.HEIGHT = height;
      this.WIDTH = width;
      this.color1 = color1;
      this.color2 = color2;
      this.currPlayer = 1; // active player: 1 or 2
      this.gameOver = false;
      this.makeBoard();
      this.makeHtmlBoard()
    }
    /** makeBoard: create in-JS board structure:
     *   board = array of rows, each row is array of cells  (board[y][x])
     */

    makeBoard() {
      this.board = [];
      for (let y = 0; y < this.HEIGHT; y++) {
        this.board.push(Array.from({ length: this.WIDTH }));
      }
      console.log(this.board)
    }

    /** makeHtmlBoard: make HTML table and row of column tops. */

    makeHtmlBoard() {
      this.handleGameClick = this.handleClick.bind(this);

      const gameGrid = document.querySelector('#game-grid');
      const board = document.createElement('table');
      board.setAttribute('id', 'board')

      // make column tops (clickable area for adding a piece to that column)
      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');
      top.addEventListener("click", this.handleGameClick);

      for (let x = 0; x < this.WIDTH; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
      }

      board.append(top);

      // make main part of board
      for (let y = 0; y < this.HEIGHT; y++) {
        const row = document.createElement('tr');

        for (let x = 0; x < this.WIDTH; x++) {
          const cell = document.createElement('td');
          cell.setAttribute('id', `${y}-${x}`);
          row.append(cell);
        }

        board.append(row);
      }
      this.startButton = document.createElement('button');
      this.startButton.innerText = "Start Game";
      this.startButton.setAttribute('class', 'startButton');
      this.startButton.addEventListener('click', newGame)
      board.append(this.startButton);

      gameGrid.append(board)
    }


    /** findSpotForCol: given column x, return top empty y (null if filled) */

    findSpotForCol(x) {
      for (let y = this.HEIGHT - 1; y >= 0; y--) {
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
      piece.classList.add(`p${this.currPlayer}`);

      if(piece.classList.contains('p1')){
        piece.style.backgroundColor = this.color1;
      }
      else {
        piece.style.backgroundColor = this.color2;
      }

      piece.style.top = -50 * (y + 2);
      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
    }

    /** endGame: announce game end */

    endGame(msg) {
      this.gameOver = true;
      const top = document.querySelector('#column-top');
      top.removeEventListener('click', this.handleClick);
      alert(msg);
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
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);

      // check for win
      if (this.checkForWin()) {
        return this.endGame(`Player ${this.currPlayer} won!`);
      }

      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }

      // switch players
      this.currPlayer = this.currPlayer === 1 ? 2 : 1;
    }

    /** checkForWin: check board cell-by-cell for "does a win start here?" */
    _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }

    checkForWin() {
      for (let y = 0; y < this.HEIGHT; y++) {
        for (let x = 0; x < this.WIDTH; x++) {
          // get "check list" of 4 cells (starting here) for each of the different
          // ways to win
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

          // find winner (only checking each win-possibility as needed)
          if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {
            return true;
          }
        }
      }
    }
  }

  game1 = new Game();

  function newGame(){
    const board = document.querySelector('#board')
    const color1 = document.querySelector('#player1').value;
    const color2 = document.querySelector('#player2').value;
    const height = document.querySelector('#height').value;
    const width = document.querySelector('#width').value;

    board.remove();
    game1 = new Game(color1, color2, height, width);
  }
