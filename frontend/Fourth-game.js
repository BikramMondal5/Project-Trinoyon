// Game constants
const BOARD_SIZE = 8;
const TILE_TYPES = ['🍎', '🍌', '🍇', '🍊', '🫐', '🍓'];
const MATCH_MIN = 3;
const INITIAL_TIME = 60;
const TARGET_SCORE = 500;

// Game state
let board = [];
let score = 0;
let timeLeft = INITIAL_TIME;
let selectedTile = null;
let isSwapping = false;
let gameActive = true;
let timer = null;

// DOM elements
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const movesElement = document.getElementById('moves');
const timeElement = document.getElementById('time');
const progressBar = document.getElementById('progress-bar');
const restartBtn = document.getElementById('restart-btn');
const hintBtn = document.getElementById('hint-btn');
const gameOverScreen = document.getElementById('game-over');
const gameOverTitle = document.getElementById('game-over-title');
const finalScoreElement = document.getElementById('final-score');
const playAgainBtn = document.getElementById('play-again-btn');
const donateBtn = document.getElementById('donate-btn');

// Initialize game
function initGame() {
    board = [];
    score = 0;
    timeLeft = INITIAL_TIME;
    selectedTile = null;
    isSwapping = false;
    gameActive = true;

    gameBoard.innerHTML = '';

    createBoard();
    updateScore();
    updateMoves();
    updateTime();

    if (timer) clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

// Create game board
function createBoard() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        const rowTiles = [];
        for (let col = 0; col < BOARD_SIZE; col++) {
            const tileType = getRandomTileType();
            rowTiles.push(tileType);
        }
        board.push(rowTiles);
    }
    resolveMatches(false); // Don't score during initial resolve
    renderBoard();
}

function getRandomTileType() {
    const randomIndex = Math.floor(Math.random() * TILE_TYPES.length);
    return TILE_TYPES[randomIndex];
}

function renderBoard() {
    gameBoard.innerHTML = '';
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.row = row;
            tile.dataset.col = col;
            tile.textContent = board[row][col];

            const tileType = board[row][col];
            const colorIndex = TILE_TYPES.indexOf(tileType);
            const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#ffc6ff'];
            tile.style.backgroundColor = colors[colorIndex];

            tile.addEventListener('click', () => handleTileClick(row, col));
            gameBoard.appendChild(tile);
        }
    }
}

function handleTileClick(row, col) {
    if (!gameActive || isSwapping) return;

    const clickedTile = { row, col };

    if (!selectedTile) {
        selectedTile = clickedTile;
        updateTileSelection(selectedTile, true);
    } else if (selectedTile.row === row && selectedTile.col === col) {
        updateTileSelection(selectedTile, false);
        selectedTile = null;
    } else {
        if (areAdjacent(selectedTile, clickedTile)) {
            swapTiles(selectedTile, clickedTile);
        } else {
            updateTileSelection(selectedTile, false);
            selectedTile = clickedTile;
            updateTileSelection(selectedTile, true);
        }
    }
}

function updateTileSelection(tile, isSelected) {
    const tileElement = document.querySelector(`.tile[data-row="${tile.row}"][data-col="${tile.col}"]`);
    if (isSelected) {
        tileElement?.classList.add('selected');
    } else {
        tileElement?.classList.remove('selected');
    }
}

function areAdjacent(tile1, tile2) {
    const rowDiff = Math.abs(tile1.row - tile2.row);
    const colDiff = Math.abs(tile1.col - tile2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function swapTiles(tile1, tile2) {
    isSwapping = true;
    updateTileSelection(tile1, false);

    const temp = board[tile1.row][tile1.col];
    board[tile1.row][tile1.col] = board[tile2.row][tile2.col];
    board[tile2.row][tile2.col] = temp;

    renderBoard();

    const matchesFound = checkForMatches();

    if (matchesFound) {
        setTimeout(() => {
            processTurn();
        }, 300);
    } else {
        setTimeout(() => {
            const temp = board[tile1.row][tile1.col];
            board[tile1.row][tile1.col] = board[tile2.row][tile2.col];
            board[tile2.row][tile2.col] = temp;
            renderBoard();
            isSwapping = false;
            selectedTile = null;
        }, 300);
    }
}

function processTurn() {
    resolveMatches();
    selectedTile = null;
    checkGameOver();
}

function checkForMatches() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col <= BOARD_SIZE - MATCH_MIN; col++) {
            const tileType = board[row][col];
            if (!tileType) continue;

            let matchLength = 1;
            for (let i = 1; i < BOARD_SIZE - col; i++) {
                if (board[row][col + i] === tileType) {
                    matchLength++;
                } else {
                    break;
                }
            }

            if (matchLength >= MATCH_MIN) return true;
        }
    }

    for (let col = 0; col < BOARD_SIZE; col++) {
        for (let row = 0; row <= BOARD_SIZE - MATCH_MIN; row++) {
            const tileType = board[row][col];
            if (!tileType) continue;

            let matchLength = 1;
            for (let i = 1; i < BOARD_SIZE - row; i++) {
                if (board[row + i][col] === tileType) {
                    matchLength++;
                } else {
                    break;
                }
            }

            if (matchLength >= MATCH_MIN) return true;
        }
    }

    return false;
}

function resolveMatches(shouldScore = true) {
    let matchFound = false;

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col <= BOARD_SIZE - MATCH_MIN; col++) {
            const tileType = board[row][col];
            if (!tileType) continue;

            let matchLength = 1;
            for (let i = 1; i < BOARD_SIZE - col; i++) {
                if (board[row][col + i] === tileType) {
                    matchLength++;
                } else {
                    break;
                }
            }

            if (matchLength >= MATCH_MIN) {
                for (let i = 0; i < matchLength; i++) {
                    board[row][col + i] = null;
                }

                if (shouldScore) {
                    score += 20;
                    updateScore();
                }

                matchFound = true;
            }
        }
    }

    for (let col = 0; col < BOARD_SIZE; col++) {
        for (let row = 0; row <= BOARD_SIZE - MATCH_MIN; row++) {
            const tileType = board[row][col];
            if (!tileType) continue;

            let matchLength = 1;
            for (let i = 1; i < BOARD_SIZE - row; i++) {
                if (board[row + i][col] === tileType) {
                    matchLength++;
                } else {
                    break;
                }
            }

            if (matchLength >= MATCH_MIN) {
                for (let i = 0; i < matchLength; i++) {
                    board[row + i][col] = null;
                }

                if (shouldScore) {
                    score += 20;
                    updateScore();
                }

                matchFound = true;
            }
        }
    }

    if (matchFound) {
        renderBoard();
        setTimeout(() => {
            fillEmptySpaces();
            renderBoard();
            setTimeout(() => {
                if (checkForMatches()) {
                    resolveMatches();
                } else {
                    isSwapping = false;
                }
            }, 300);
        }, 300);
    } else {
        isSwapping = false;
    }
}

function fillEmptySpaces() {
    for (let col = 0; col < BOARD_SIZE; col++) {
        let emptyCount = 0;
        for (let row = BOARD_SIZE - 1; row >= 0; row--) {
            if (board[row][col] === null) {
                emptyCount++;
            } else if (emptyCount > 0) {
                board[row + emptyCount][col] = board[row][col];
                board[row][col] = null;
            }
        }
        for (let row = 0; row < emptyCount; row++) {
            board[row][col] = getRandomTileType();
        }
    }
}

function updateScore() {
    scoreElement.textContent = score;
    const progress = Math.min(score / TARGET_SCORE * 100, 100);
    progressBar.style.width = `${progress}%`;
    if (score >= TARGET_SCORE) {
        endGame(true);
    }
}

function updateMoves() {
    movesElement.textContent = '∞';
}

function updateTimer() {
    if (!gameActive) return;
    timeLeft--;
    updateTime();
    if (timeLeft <= 0) {
        endGame(false);
    }
}

function updateTime() {
    timeElement.textContent = timeLeft;
}

function checkGameOver() {
    if (timeLeft <= 0) {
        endGame(false);
    } else if (score >= TARGET_SCORE) {
        endGame(true);
    }
}

function endGame(isWin) {
    gameActive = false;
    clearInterval(timer);
    gameOverTitle.textContent = isWin ? 'You Won!' : 'Game Over';
    finalScoreElement.textContent = score;
    gameOverScreen.classList.add('active');
}

// Event listeners
restartBtn.addEventListener('click', initGame);
hintBtn.addEventListener('click', showHint);
playAgainBtn.addEventListener('click', () => {
    gameOverScreen.classList.remove('active');
    initGame();
});


// Hint function remains unchanged
function checkForPossibleMoves() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE - 1; col++) {
            const temp = board[row][col];
            board[row][col] = board[row][col + 1];
            board[row][col + 1] = temp;
            const hasMatch = checkForMatches();
            board[row][col + 1] = board[row][col];
            board[row][col] = temp;
            if (hasMatch) return { row, col, direction: 'right' };
        }
    }
    for (let row = 0; row < BOARD_SIZE - 1; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const temp = board[row][col];
            board[row][col] = board[row + 1][col];
            board[row + 1][col] = temp;
            const hasMatch = checkForMatches();
            board[row + 1][col] = board[row][col];
            board[row][col] = temp;
            if (hasMatch) return { row, col, direction: 'down' };
        }
    }
    return null;
}

function showHint() {
    if (!gameActive) return;
    const hint = checkForPossibleMoves();
    if (hint) {
        const tile1 = document.querySelector(`.tile[data-row="${hint.row}"][data-col="${hint.col}"]`);
        let tile2;
        if (hint.direction === 'right') {
            tile2 = document.querySelector(`.tile[data-row="${hint.row}"][data-col="${hint.col + 1}"]`);
        } else {
            tile2 = document.querySelector(`.tile[data-row="${hint.row + 1}"][data-col="${hint.col}"]`);
        }
        tile1.style.transform = 'scale(1.1)';
        tile2.style.transform = 'scale(1.1)';
        setTimeout(() => {
            tile1.style.transform = '';
            tile2.style.transform = '';
        }, 1000);
    }
}

// Start game
initGame();

