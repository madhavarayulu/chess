// Selecting DOM elements
const gameBoard = document.querySelector('#gameboard');
const playerDisplay = document.querySelector('#player');
const infoDisplay = document.querySelector('#info-display');

// Board dimensions
const width = 8;

// Initial player turn
let playerGo = 'black';
playerDisplay.textContent = 'black';

// Array representing the initial pieces on the board
const startPieces = [
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  pawn,
  rook,
  knight,
  bishop,
  queen,
  king,
  bishop,
  knight,
  rook,
];

// Function to create the initial game board
function createBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement('div');
    square.classList.add('square');
    square.innerHTML = startPiece;
    square.firstChild?.setAttribute('draggable', true);
    square.setAttribute('square-id', i);

    // Calculate row and apply alternating colors
    const row = Math.floor((63 - i) / 8) + 1;
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? 'gray' : 'brown');
    } else {
      square.classList.add(i % 2 === 0 ? 'brown' : 'gray');
    }

    // Apply initial piece colors
    if (i <= 15) {
      square.firstChild.firstChild.classList.add('black');
    }
    if (i >= 48) {
      square.firstChild.firstChild.classList.add('white');
    }

    // Append square to the game board
    gameBoard.append(square);
  });
}

// Call the function to create the board
createBoard();

// Select all squares on the board
const allSquares = document.querySelectorAll('.square');

// Add drag-and-drop event listeners to all squares
allSquares.forEach((square) => {
  square.addEventListener('dragstart', dragStart);
  square.addEventListener('dragover', dragOver);
  square.addEventListener('drop', dragDrop);
});

// Variables to track the dragged element and its starting position
let startPositionId;
let draggedElement;

// Event handler for drag start
function dragStart(e) {
  startPositionId = e.target.parentNode.getAttribute('square-id');
  draggedElement = e.target;
}

// Event handler for drag over
function dragOver(e) {
  e.preventDefault();
}

// Event handler for drag drop
function dragDrop(e) {
  e.stopPropagation();
  const correctGo = draggedElement.firstChild.classList.contains(playerGo);
  const taken = e.target.classList.contains('piece');
  const valid = checkIfValid(e.target);
  const opponentGo = playerGo === 'white' ? 'black' : 'white';
  const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);

  if (correctGo) {
    if (takenByOpponent && valid) {
      e.target.parentNode.append(draggedElement);
      e.target.remove();
      checkForWin();
      changePlayer();
      return;
    }
    if (taken && !takenByOpponent) {
      infoDisplay.textContent = 'You cannot go here!';
      setTimeout(() => (infoDisplay.textContent = ''), 2000);
      return;
    }
    if (valid) {
      e.target.append(draggedElement);
      checkForWin();
      changePlayer();
      return;
    }
  }
}

// Function to check if the move is valid
function checkIfValid(target) {
  const targetId =
    Number(target.getAttribute('square-id')) ||
    Number(target.parentNode.getAttribute('square-id'));
  const startId = Number(startPositionId);
  const piece = draggedElement.id;

  // Log information for debugging
  console.log('piece', piece);
  console.log('start id', startId);
  console.log('target id', targetId);

  switch (piece) {
    // Pawn movement rules
    case 'pawn':
      const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
      if (
        (starterRow.includes(startId) && startId + width * 2 === targetId) ||
        startId + width === targetId ||
        (startId + width - 1 === targetId &&
          document.querySelector(`[square-id = "${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width + 1 === targetId &&
          document.querySelector(`[square-id = "${startId + width + 1}"]`)
            .firstChild)
      ) {
        return true;
      }
      break;

    // Knight movement rules
    case 'knight':
      if (
        // forward
        startId + width * 2 + 1 === targetId ||
        startId + width * 2 - 1 === targetId ||
        startId + width - 2 === targetId ||
        startId + width + 2 === targetId ||
        // backward
        startId - width * 2 + 1 === targetId ||
        startId - width * 2 - 1 === targetId ||
        startId - width - 2 === targetId ||
        startId - width + 2 === targetId
      ) {
        return true;
      }
      break;

    // Bishop movement rules
    case 'bishop':
      if (
        startId + width + 1 === targetId ||
        (startId + width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild) ||
        (startId + width * 3 + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild) ||
        (startId + width * 4 + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild) ||
        (startId + width * 5 + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild) ||
        (startId + width * 6 + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild) ||
        (startId + width * 7 + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`)
            .firstChild) ||
        // other direction
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`)
            .firstChild) ||
        // reverse direction
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild) ||
        (startId - width * 3 + 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild) ||
        (startId - width * 4 + 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild) ||
        (startId - width * 5 + 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild) ||
        (startId - width * 6 + 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild) ||
        (startId - width * 7 + 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`)
            .firstChild) ||
        // ---
        startId + width - 1 === targetId ||
        (startId + width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild) ||
        (startId + width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild) ||
        (startId + width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild) ||
        (startId + width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild) ||
        (startId + width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`)
            .firstChild)
      ) {
        return true;
      }
      break;

    // Rook movement rules
    case 'rook':
      if (
        startId + width === targetId ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId + width * 3}"]`)
          .firstChild ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId + width * 3}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId + width * 4}"]`)
          .firstChild ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId + width * 3}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId + width * 4}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId + width * 5}"]`)
          .firstChild ||
        (startId + width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId + width * 3}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId + width * 4}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId + width * 5}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId + width * 6}"]`)
          .firstChild ||
        // ---
        startId - width === targetId ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId - width * 3}"]`)
          .firstChild ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId - width * 3}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId - width * 4}"]`)
          .firstChild ||
        (startId - width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId - width * 3}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId - width * 4}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId - width * 5}"]`)
          .firstChild ||
        (startId - width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId - width * 3}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId - width * 4}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId - width * 5}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId - width * 6}"]`)
          .firstChild ||
        // ---
        startId + 1 === targetId ||
        (startId + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId + 3}"]`).firstChild ||
        (startId + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId + 3}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId + 4}"]`).firstChild ||
        (startId + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId + 3}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId + 4}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId + 5}"]`).firstChild ||
        (startId + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId + 3}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId + 4}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId + 5}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId + 6}"]`).firstChild ||
        // ---
        startId - 1 === targetId ||
        (startId - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId - 3}"]`).firstChild ||
        (startId - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId - 3}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId - 4}"]`).firstChild ||
        (startId - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId - 3}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId - 4}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId - 5}"]`).firstChild ||
        (startId - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId - 3}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId - 4}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId - 5}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId - 6}"]`).firstChild
      ) {
        return true;
      }
      break;

    // Queen movement rules
    case 'queen':
      if (
        // Check for valid bishop moves
        // Forward diagonal moves
        startId + width + 1 === targetId ||
        // Check for empty squares in between for longer diagonal moves
        (startId + width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild) ||
        (startId + width * 3 + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild) ||
        (startId + width * 4 + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild) ||
        (startId + width * 5 + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild) ||
        (startId + width * 6 + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild) ||
        (startId + width * 7 + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`)
            .firstChild) ||
        // other direction
        startId - width - 1 === targetId ||
        (startId - width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild) ||
        (startId - width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild) ||
        (startId - width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild) ||
        (startId - width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild) ||
        (startId - width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild) ||
        (startId - width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6 - 6}"]`)
            .firstChild) ||
        // reverse direction
        startId - width + 1 === targetId ||
        (startId - width * 2 + 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild) ||
        (startId - width * 3 + 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild) ||
        (startId - width * 4 + 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild) ||
        (startId - width * 5 + 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild) ||
        (startId - width * 6 + 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild) ||
        (startId - width * 7 + 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width + 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 6 + 6}"]`)
            .firstChild) ||
        // ---
        startId + width - 1 === targetId ||
        (startId + width * 2 - 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild) ||
        (startId + width * 3 - 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild) ||
        (startId + width * 4 - 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild) ||
        (startId + width * 5 - 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild) ||
        (startId + width * 6 - 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild) ||
        (startId + width * 7 - 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width - 1}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`)
            .firstChild) ||
        // rook moves
        startId + width === targetId ||
        (startId + width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild) ||
        (startId + width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        (startId + width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId + width * 3}"]`)
          .firstChild ||
        (startId + width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId + width * 3}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId + width * 4}"]`)
          .firstChild ||
        (startId + width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId + width * 3}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId + width * 4}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId + width * 5}"]`)
          .firstChild ||
        (startId + width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId + width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId + width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId + width * 3}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId + width * 4}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId + width * 5}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId + width * 6}"]`)
          .firstChild ||
        // ---
        startId - width === targetId ||
        (startId - width * 2 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild) ||
        (startId - width * 3 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        (startId - width * 4 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId - width * 3}"]`)
          .firstChild ||
        (startId - width * 5 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId - width * 3}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId - width * 4}"]`)
          .firstChild ||
        (startId - width * 6 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId - width * 3}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId - width * 4}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId - width * 5}"]`)
          .firstChild ||
        (startId - width * 7 === targetId &&
          !document.querySelector(`[square-id="${startId - width}"]`)
            .firstChild &&
          !document.querySelector(`[square-id="${startId - width * 2}"]`)
            .firstChild) ||
        !document.querySelector(`[square-id="${startId - width * 3}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId - width * 4}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId - width * 5}"]`)
          .firstChild ||
        !document.querySelector(`[square-id="${startId - width * 6}"]`)
          .firstChild ||
        // ---
        startId + 1 === targetId ||
        (startId + 2 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild) ||
        (startId + 3 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        (startId + 4 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId + 3}"]`).firstChild ||
        (startId + 5 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId + 3}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId + 4}"]`).firstChild ||
        (startId + 6 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId + 3}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId + 4}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId + 5}"]`).firstChild ||
        (startId + 7 === targetId &&
          !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId + 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId + 3}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId + 4}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId + 5}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId + 6}"]`).firstChild ||
        // ---
        startId - 1 === targetId ||
        (startId - 2 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild) ||
        (startId - 3 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        (startId - 4 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId - 3}"]`).firstChild ||
        (startId - 5 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId - 3}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId - 4}"]`).firstChild ||
        (startId - 6 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId - 3}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId - 4}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId - 5}"]`).firstChild ||
        (startId - 7 === targetId &&
          !document.querySelector(`[square-id="${startId - 1}"]`).firstChild &&
          !document.querySelector(`[square-id="${startId - 2}"]`).firstChild) ||
        !document.querySelector(`[square-id="${startId - 3}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId - 4}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId - 5}"]`).firstChild ||
        !document.querySelector(`[square-id="${startId - 6}"]`).firstChild
      ) {
        return true;
      }
      break;

    // King movement rules
    case 'king':
      if (
        // Check for valid king moves (adjacent squares)
        startId + 1 === targetId ||
        startId - 1 === targetId ||
        startId + width === targetId ||
        startId - width === targetId ||
        startId + width - 1 === targetId ||
        startId + width + 1 === targetId ||
        startId - width - 1 === targetId ||
        startId - width + 1 === targetId
      ) {
        return true;
      }
  }
}

// Function to switch player turn
function changePlayer() {
  if (playerGo === 'black') {
    // Reverse square IDs for black player
    reverseIds();
    playerGo = 'white';
    playerDisplay.textContent = 'white';
  } else {
    // Revert square IDs for white player
    revertIds();
    playerGo = 'black';
    playerDisplay.textContent = 'black';
  }
}

// Function to reverse square IDs
function reverseIds() {
  const allSquares = document.querySelectorAll('.square');
  allSquares.forEach((square, i) => {
    square.setAttribute('square-id', width * width - 1 - i);
  });
}

// Function to revert square IDs
function revertIds() {
  const allSquares = document.querySelectorAll('.square');
  allSquares.forEach((square, i) => {
    square.setAttribute('square-id', i);
  });
}

// Function to check for a win condition
function checkForWin() {
  const kings = Array.from(document.querySelectorAll('#king'));
  // Check if there are no white kings on the board
  if (!kings.some((king) => king.firstChild.classList.contains('white'))) {
    infoDisplay.innerHTML = 'Black player wins!';
    // Disable dragging for all pieces
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute('draggable', false)
    );
  }
  // Check if there are no black kings on the board
  if (!kings.some((king) => king.firstChild.classList.contains('black'))) {
    infoDisplay.innerHTML = 'White player wins!';
    // Disable dragging for all pieces
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach((square) =>
      square.firstChild?.setAttribute('draggable', false)
    );
  }
}
