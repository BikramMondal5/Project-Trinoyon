
// Game constants
const GAME_WIDTH = 600; // Increased dimension
const GAME_HEIGHT = 600; // Increased dimension
const SPACE_SIZE = 50;
const BODY_PARTS = 3;
const FOOD_COLOR = "#FF0000"
const BACKGROUND_COLOR = "#000000";
const SPEED = 300;

// Game variables
let canvas = document.getElementById("game-canvas");
let ctx = canvas.getContext("2d");
let score = 0;
let direction = 'down';
let gameOver = false;
let snake = [];
let food = {};

// Initialize the game
function initGame() {
    score = 0;
    direction = 'down';
    gameOver = false;
    document.getElementById("score-label").textContent = "Score: 0";
    document.getElementById("game-over").style.display = "none";
    
    // Initialize snake
    snake = [];
    for (let i = 0; i < BODY_PARTS; i++) {
        snake.push({x: 0, y: 0});
    }
    
    // Create food
    createFood();
    
    // Start game loop
    draw();
}

// Create food at random position
function createFood() {
    food = {
        x: Math.floor(Math.random() * (GAME_WIDTH / SPACE_SIZE)) * SPACE_SIZE,
        y: Math.floor(Math.random() * (GAME_HEIGHT / SPACE_SIZE)) * SPACE_SIZE
    };

    // Prevent food from spawning on snake
    for (let part of snake) {
        if (part.x === food.x && part.y === food.y) {
            createFood();
            return;
        }
    }
}

// Main game loop
function draw() {
    if (gameOver) return;

    // Clear canvas
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw food
    ctx.fillStyle = FOOD_COLOR;
    ctx.beginPath();
    ctx.arc(food.x + SPACE_SIZE/2, food.y + SPACE_SIZE/2, SPACE_SIZE/2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Move snake
    let newHead = {x: snake[0].x, y: snake[0].y};
    
    if (direction === 'up') {
        newHead.y -= SPACE_SIZE;
    } else if (direction === 'down') {
        newHead.y += SPACE_SIZE;
    } else if (direction === 'left') {
        newHead.x -= SPACE_SIZE;
    } else if (direction === 'right') {
        newHead.x += SPACE_SIZE;
    }
    
    // Check collision with walls
    if (newHead.x < 0 || newHead.x >= GAME_WIDTH || newHead.y < 0 || newHead.y >= GAME_HEIGHT) {
        gameIsOver();
        return;
    }
    
    // Check collision with self
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
            gameIsOver();
            return;
        }
    }
    
    // Check if food eaten
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        document.getElementById("score-label").textContent = "Score: " + score;
        createFood();
    } else {
        snake.pop(); // Remove tail if no food eaten
    }
    
    // Add new head
    snake.unshift(newHead);
    
    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        const part = snake[i];
        
        // Calculate alpha based on position (head more opaque)
        const alpha = Math.max(0.5, 1 - (i * 0.05));
        ctx.fillStyle = `rgba(144, 255, 144, ${alpha})`; // New snake color with alpha
        
        // Draw circular snake parts
        ctx.beginPath();
        ctx.arc(part.x + SPACE_SIZE/2, part.y + SPACE_SIZE/2, SPACE_SIZE/2 - 1, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add happy face to head
        if (i === 0) {
            // Eyes
            ctx.fillStyle = "#000";
            
            // Position features based on direction
            if (direction === 'left') {
                // Left-facing eyes
                ctx.beginPath();
                ctx.arc(part.x + SPACE_SIZE/2 - 12, part.y + SPACE_SIZE/2 - 8, 6, 0, 2 * Math.PI);
                ctx.arc(part.x + SPACE_SIZE/2 - 12, part.y + SPACE_SIZE/2 + 8, 6, 0, 2 * Math.PI);
                ctx.fill();
                
            } else if (direction === 'right') {
                // Right-facing eyes
                ctx.beginPath();
                ctx.arc(part.x + SPACE_SIZE/2 + 12, part.y + SPACE_SIZE/2 - 8, 6, 0, 2 * Math.PI);
                ctx.arc(part.x + SPACE_SIZE/2 + 12, part.y + SPACE_SIZE/2 + 8, 6, 0, 2 * Math.PI);
                ctx.fill();
                
             
            } else if (direction === 'up') {
                // Up-facing eyes
                ctx.beginPath();
                ctx.arc(part.x + SPACE_SIZE/2 - 8, part.y + SPACE_SIZE/2 - 12, 6, 0, 2 * Math.PI);
                ctx.arc(part.x + SPACE_SIZE/2 + 8, part.y + SPACE_SIZE/2 - 12, 6, 0, 2 * Math.PI);
                ctx.fill();
                
          
            } else {
                // Down-facing eyes
                ctx.beginPath();
                ctx.arc(part.x + SPACE_SIZE/2 - 8, part.y + SPACE_SIZE/2 + 12, 6, 0, 2 * Math.PI);
                ctx.arc(part.x + SPACE_SIZE/2 + 8, part.y + SPACE_SIZE/2 + 12, 6, 0, 2 * Math.PI);
                ctx.fill();
                
           
            }
        }
    }
    
    // Continue game loop
    setTimeout(draw, SPEED);
}

// Game over function
function gameIsOver() {
    gameOver = true;
    document.getElementById("game-over").style.display = "flex";
}

// Change direction handler
function changeDirection(event) {
    const key = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    
    // Prevent reverse direction
    if (key === LEFT && direction !== 'right') {
        direction = 'left';
    } else if (key === UP && direction !== 'down') {
        direction = 'up';
    } else if (key === RIGHT && direction !== 'left') {
        direction = 'right';
    } else if (key === DOWN && direction !== 'up') {
        direction = 'down';
    }
}

// Event listeners
document.addEventListener("keydown", changeDirection);
document.getElementById("restart-button").addEventListener("click", initGame);

// Start the game
initGame();