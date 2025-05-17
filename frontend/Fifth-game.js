  // Game constants
    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 30;
    const NEXT_BLOCK_SIZE = 20;
    
    // Tetromino shapes and their rotations
    const TETROMINOS = [
        { // I
            shape: [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            color: 0
        },
        { // J
            shape: [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            color: 1
        },
        { // L
            shape: [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ],
            color: 2
        },
        { // O
            shape: [
                [1, 1],
                [1, 1]
            ],
            color: 3
        },
        { // S
            shape: [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ],
            color: 4
        },
        { // T
            shape: [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            color: 5
        },
        { // Z
            shape: [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            color: 6
        }
    ];
    
    // Game variables
    let board = createBoard();
    let currentPiece = null;
    let nextPiece = null;
    let score = 0;
    let lines = 0;
    let level = 1;
    let gameInterval = null;
    let isPaused = false;
    let gameOver = false;
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // DOM elements
        const gameBoard = document.getElementById('game-board');
        const nextPieceDisplay = document.getElementById('next-piece-display');
        const scoreElement = document.getElementById('score');
        const linesElement = document.getElementById('lines');
        const levelElement = document.getElementById('level');
        const finalScoreElement = document.getElementById('final-score');
        const gameOverScreen = document.querySelector('.game-over');
        const startButton = document.getElementById('start-button');
        const restartButton = document.getElementById('restart-button');
        
        // Make these elements globally accessible
        window.gameBoard = gameBoard;
        window.nextPieceDisplay = nextPieceDisplay;
        window.scoreElement = scoreElement;
        window.linesElement = linesElement;
        window.levelElement = levelElement;
        window.finalScoreElement = finalScoreElement;
        window.gameOverScreen = gameOverScreen;
        window.startButton = startButton;
        window.restartButton = restartButton;
        
        // Event listeners
        if (startButton) {
            startButton.addEventListener('click', startGame);
        }
        if (restartButton) {
            restartButton.addEventListener('click', function() {
                resetGame();
                startGame(); // Ensure the game starts after reset
            });
        }
    });
    
    document.addEventListener('keydown', event => {
        if (gameOver || !currentPiece) return;
        
        switch (event.key) {
            case 'ArrowLeft':
                if (!isPaused) movePiece(-1, 0);
                break;
            case 'ArrowRight':
                if (!isPaused) movePiece(1, 0);
                break;
            case 'ArrowDown':
                if (!isPaused) movePiece(0, 1);
                break;
            case 'ArrowUp':
                if (!isPaused) rotatePiece();
                break;
            case ' ':
                if (!isPaused) hardDrop();
                break;
            case 'p':
            case 'P':
                togglePause();
                break;
        }
    });
    
    // Create empty game board
    function createBoard() {
        const board = [];
        for (let row = 0; row < ROWS; row++) {
            board[row] = [];
            for (let col = 0; col < COLS; col++) {
                board[row][col] = 0;
            }
        }
        return board;
    }
    
    // Start the game
    function startGame() {
        try {
            console.log("Starting game...");
            
            if (gameInterval) {
                clearInterval(gameInterval);
                gameInterval = null;
            }
            
            // Initialize game state if not already done by resetGame
            if (board === null || currentPiece === null) {
                board = createBoard();
                score = 0;
                lines = 0;
                level = 1;
                gameOver = false;
                isPaused = false;
                currentPiece = null;
                nextPiece = null;
                
                // Clear the board
                const blocks = gameBoard.querySelectorAll('.block');
                blocks.forEach(block => {
                    if (block.parentNode === gameBoard) {
                        gameBoard.removeChild(block);
                    }
                });
                
                // Clear the next piece display
                while (nextPieceDisplay.firstChild) {
                    nextPieceDisplay.removeChild(nextPieceDisplay.firstChild);
                }
            }
            
            // Hide game over screen
            if (gameOverScreen) {
                gameOverScreen.style.display = 'none';
            }
            
            // Remove any pause overlay if present
            const pauseOverlay = document.getElementById('pause-overlay');
            if (pauseOverlay && pauseOverlay.parentNode) {
                pauseOverlay.parentNode.removeChild(pauseOverlay);
            }
            
            // Generate pieces and start the game loop
            generateNewPiece();
            generateNewPiece();
            updateScore();
            
            gameInterval = setInterval(() => {
                if (!isPaused && !gameOver) {
                    moveDown();
                }
            }, getSpeed());
            
            startButton.textContent = 'Game Started';
            startButton.disabled = true;
            
            console.log("Game started successfully.");
        } catch (error) {
            console.error("Error in startGame:", error);
        }
    }
    
    // Reset the game
    function resetGame() {
        try {
            console.log("Resetting game...");
            
            if (gameInterval) {
                clearInterval(gameInterval);
                gameInterval = null;
            }
            
            board = createBoard();
            score = 0;
            lines = 0;
            level = 1;
            gameOver = false;
            isPaused = false;
            currentPiece = null;
            nextPiece = null;
            
            // Clear the board - safer way to remove children
            const blocks = gameBoard.querySelectorAll('.block');
            blocks.forEach(block => {
                if (block.parentNode === gameBoard) {
                    gameBoard.removeChild(block);
                }
            });
            
            // Clear the next piece display
            while (nextPieceDisplay.firstChild) {
                nextPieceDisplay.removeChild(nextPieceDisplay.firstChild);
            }
            
            // Hide game over screen
            if (gameOverScreen) {
                gameOverScreen.style.display = 'none';
            }
            
            // Remove any pause overlay if present
            const pauseOverlay = document.getElementById('pause-overlay');
            if (pauseOverlay && pauseOverlay.parentNode) {
                pauseOverlay.parentNode.removeChild(pauseOverlay);
            }
            
            // Reset button
            startButton.textContent = 'Start Game';
            startButton.disabled = false;
            
            updateScore();
            console.log("Game reset complete.");
        } catch (error) {
            console.error("Error in resetGame:", error);
        }
    }
    
    // Generate a new tetromino piece
    function generateNewPiece() {
        try {
            if (currentPiece === null) {
                currentPiece = getRandomPiece();
            } else {
                currentPiece = nextPiece;
            }
            
            nextPiece = getRandomPiece();
            
            // Check if game over (can't place new piece)
            if (!isValidMove(currentPiece.shape, currentPiece.x, currentPiece.y)) {
                endGame();
                return;
            }
            
            drawPiece();
            drawNextPiece();
        } catch (error) {
            console.error("Error in generateNewPiece:", error);
        }
    }
    
    // End the game
    function endGame() {
        try {
            gameOver = true;
            if (gameInterval) {
                clearInterval(gameInterval);
                gameInterval = null;
            }
            if (finalScoreElement) {
                finalScoreElement.textContent = score;
            }
            if (gameOverScreen) {
                gameOverScreen.style.display = 'flex';
            }
            
            // Remove any pause overlay if present
            const pauseOverlay = document.getElementById('pause-overlay');
            if (pauseOverlay && pauseOverlay.parentNode) {
                pauseOverlay.parentNode.removeChild(pauseOverlay);
            }
            
            console.log("Game over triggered. Score:", score);
        } catch (error) {
            console.error("Error in endGame:", error);
        }
    }
    
    // Get random tetromino
    function getRandomPiece() {
        try {
            const randIndex = Math.floor(Math.random() * TETROMINOS.length);
            const piece = TETROMINOS[randIndex];
            
            // Create a deep copy of the shape to avoid reference issues
            const shapeCopy = piece.shape.map(row => [...row]);
            
            return {
                shape: shapeCopy,
                color: piece.color,
                x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2),
                y: 0
            };
        } catch (error) {
            console.error("Error in getRandomPiece:", error);
            // Return a fallback piece (I-shape) if there's an error
            return {
                shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
                color: 0,
                x: 3,
                y: 0
            };
        }
    }
    
    // Draw the current piece on the board
    function drawPiece() {
        try {
            if (!currentPiece || !currentPiece.shape) {
                console.error("Current piece is undefined or has no shape");
                return;
            }
            
            const { shape, color, x, y } = currentPiece;
            
            shape.forEach((row, rowIndex) => {
                row.forEach((value, colIndex) => {
                    if (value) {
                        const block = document.createElement('div');
                        block.classList.add('block', `color-${color}`);
                        block.style.top = `${(y + rowIndex) * BLOCK_SIZE}px`;
                        block.style.left = `${(x + colIndex) * BLOCK_SIZE}px`;
                        block.setAttribute('data-piece', 'current');
                        gameBoard.appendChild(block);
                    }
                });
            });
        } catch (error) {
            console.error("Error in drawPiece:", error);
        }
    }
    
    // Draw the next piece preview
    function drawNextPiece() {
        // Clear previous next piece
        while (nextPieceDisplay.firstChild) {
            nextPieceDisplay.removeChild(nextPieceDisplay.firstChild);
        }
        
        const { shape, color } = nextPiece;
        const centerX = (120 - shape[0].length * NEXT_BLOCK_SIZE) / 2;
        const centerY = (120 - shape.length * NEXT_BLOCK_SIZE) / 2;
        
        shape.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                if (value) {
                    const block = document.createElement('div');
                    block.classList.add('next-block', `color-${color}`);
                    block.style.top = `${centerY + rowIndex * NEXT_BLOCK_SIZE}px`;
                    block.style.left = `${centerX + colIndex * NEXT_BLOCK_SIZE}px`;
                    nextPieceDisplay.appendChild(block);
                }
            });
        });
    }
    
    // Clear the current piece from the board
    function clearPiece() {
        const currentBlocks = document.querySelectorAll('[data-piece="current"]');
        currentBlocks.forEach(block => {
            gameBoard.removeChild(block);
        });
    }
    
    // Move the piece
    function movePiece(dx, dy) {
        clearPiece();
        
        const newX = currentPiece.x + dx;
        const newY = currentPiece.y + dy;
        
        if (isValidMove(currentPiece.shape, newX, newY)) {
            currentPiece.x = newX;
            currentPiece.y = newY;
            drawPiece();
            return true;
        }
        
        drawPiece();
        return false;
    }
    
    // Move piece down
    function moveDown() {
        const moved = movePiece(0, 1);
        
        if (!moved) {
            lockPiece();
            clearLines();
            generateNewPiece();
        }
    }
    
    // Hard drop - move piece all the way down
    function hardDrop() {
        clearPiece();
        
        let dropDistance = 0;
        while (isValidMove(currentPiece.shape, currentPiece.x, currentPiece.y + dropDistance + 1)) {
            dropDistance++;
        }
        
        currentPiece.y += dropDistance;
        drawPiece();
        lockPiece();
        clearLines();
        generateNewPiece();
    }
    
    // Rotate the piece
    function rotatePiece() {
        clearPiece();
        
        const rotated = rotate(currentPiece.shape);
        
        // Try normal position
        if (isValidMove(rotated, currentPiece.x, currentPiece.y)) {
            currentPiece.shape = rotated;
            drawPiece();
            return;
        }
        
        // Wall kicks - try slightly different positions
        const kicks = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: -1 },
            { x: 2, y: 0 },
            { x: -2, y: 0 }
        ];
        
        for (const kick of kicks) {
            if (isValidMove(rotated, currentPiece.x + kick.x, currentPiece.y + kick.y)) {
                currentPiece.shape = rotated;
                currentPiece.x += kick.x;
                currentPiece.y += kick.y;
                drawPiece();
                return;
            }
        }
        
        // If rotation fails, keep original shape
        drawPiece();
    }
    
    // Rotate matrix (2D array)
    function rotate(matrix) {
        const N = matrix.length;
        const result = Array.from({ length: N }, () => Array(N).fill(0));
        
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                result[j][N - 1 - i] = matrix[i][j];
            }
        }
        
        return result;
    }
    
    // Check if a move is valid
    function isValidMove(shape, x, y) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    // Check boundaries
                    if (newX < 0 || newX >= COLS || newY >= ROWS) {
                        return false;
                    }
                    
                    // Check if cell is already filled
                    if (newY >= 0 && board[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }
    
    // Lock the piece to the board
    function lockPiece() {
        const { shape, color, x, y } = currentPiece;
        
        shape.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                if (value) {
                    const boardY = y + rowIndex;
                    const boardX = x + colIndex;
                    
                    if (boardY >= 0) {
                        board[boardY][boardX] = color + 1; // Store color (+1 to avoid 0)
                    }
                }
            });
        });
        
        // Remove current piece markers and let the elements stay on board
        const currentBlocks = document.querySelectorAll('[data-piece="current"]');
        currentBlocks.forEach(block => {
            block.removeAttribute('data-piece');
        });
    }
    
    // Clear completed lines
    function clearLines() {
        let linesCleared = 0;
        
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row].every(cell => cell > 0)) {
                // Remove the blocks visually
                board[row].forEach((_, col) => {
                    const y = row * BLOCK_SIZE;
                    const x = col * BLOCK_SIZE;
                    
                    const blocks = Array.from(gameBoard.children)
                        .filter(child => !child.classList.contains('game-over') && 
                                parseInt(child.style.top) === y && 
                                parseInt(child.style.left) === x);
                    
                    blocks.forEach(block => gameBoard.removeChild(block));
                });
                
                // Move down all blocks above this row
                for (let r = row; r > 0; r--) {
                    board[r] = [...board[r - 1]];
                }
                
                // Empty the top row
                board[0] = Array(COLS).fill(0);
                
                // Update visual position of blocks
                Array.from(gameBoard.children)
                    .filter(child => !child.classList.contains('game-over'))
                    .forEach(block => {
                        const blockY = parseInt(block.style.top) / BLOCK_SIZE;
                        if (blockY < row) {
                            block.style.top = `${(blockY + 1) * BLOCK_SIZE}px`;
                        }
                    });
                
                linesCleared++;
                row++; // Check the same row again (now with new blocks)
            }
        }
        
        if (linesCleared > 0) {
            // Update score
            lines += linesCleared;
            
            // Score points (original Nintendo scoring system)
            const linePoints = [0, 40, 100, 300, 1200];
            score += linePoints[linesCleared] * level;
            
            // Level up every 10 lines
            level = Math.floor(lines / 10) + 1;
            
            // Update speed based on level
            if (gameInterval) {
                clearInterval(gameInterval);
                gameInterval = setInterval(() => {
                    if (!isPaused) {
                        moveDown();
                    }
                }, getSpeed());
            }
            
            updateScore();
        }
    }
    
    // Get game speed based on level
    function getSpeed() {
        // Original Tetris NES speed formula (adjusted for milliseconds)
        return Math.max(100, 800 - ((level - 1) * 50));
    }
    
    // Update score display
    function updateScore() {
        try {
            if (scoreElement && linesElement && levelElement) {
                scoreElement.textContent = score;
                linesElement.textContent = lines;
                levelElement.textContent = level;
            }
        } catch (error) {
            console.error("Error in updateScore:", error);
        }
    }
    
    // Toggle pause
    function togglePause() {
        try {
            isPaused = !isPaused;
            if (isPaused) {
                startButton.textContent = 'Game Paused';
            } else {
                startButton.textContent = 'Game Running';
            }
            
            // Add a visual indicator for paused state
            if (isPaused) {
                const pauseOverlay = document.createElement('div');
                pauseOverlay.id = 'pause-overlay';
                pauseOverlay.style.position = 'absolute';
                pauseOverlay.style.top = '0';
                pauseOverlay.style.left = '0';
                pauseOverlay.style.width = '100%';
                pauseOverlay.style.height = '100%';
                pauseOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                pauseOverlay.style.display = 'flex';
                pauseOverlay.style.justifyContent = 'center';
                pauseOverlay.style.alignItems = 'center';
                pauseOverlay.style.zIndex = '5';
                
                const pauseText = document.createElement('div');
                pauseText.textContent = 'PAUSED';
                pauseText.style.color = 'white';
                pauseText.style.fontSize = '24px';
                pauseText.style.fontWeight = 'bold';
                
                pauseOverlay.appendChild(pauseText);
                gameBoard.appendChild(pauseOverlay);
            } else {
                const existingOverlay = document.getElementById('pause-overlay');
                if (existingOverlay) {
                    gameBoard.removeChild(existingOverlay);
                }
            }
        } catch (error) {
            console.error("Error in togglePause:", error);
        }
    }