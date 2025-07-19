// Game variables
let score = 0;
let isJumping = false;
let isGameOver = false;
let gameSpeed = 5;
let speedMultiplier = 1;
let level = 1;
let gameInterval;
let obstacleInterval;
let cloudInterval;
let scoreInterval;
let speedIncreaseInterval;

// DOM elements
const gameContainer = document.querySelector('.game-container');
const character = document.querySelector('.character');
const scoreDisplay = document.getElementById('score');
const speedDisplay = document.getElementById('speed');
const levelDisplay = document.getElementById('level');
const finalScoreDisplay = document.getElementById('final-score');
const finalLevelDisplay = document.getElementById('final-level');
const gameOverScreen = document.querySelector('.game-over');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const donateButton = document.getElementById('donate-button');

// Constants
const GROUND_LEVEL = 20;
const JUMP_HEIGHT = 120;
const JUMP_DURATION = 1000; // 1 second in milliseconds
const INITIAL_OBSTACLE_INTERVAL = 1500;
const INITIAL_GAME_SPEED = 5;
const SPEED_INCREASE_INTERVAL = 5000; // Speed increases every 5 seconds
const SPEED_INCREASE_AMOUNT = 0.2;
const LEVEL_THRESHOLD = 100; // Score needed to advance to the next level

// Event listeners
document.addEventListener('keydown', handleKeyDown);
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
donateButton.addEventListener('click', openDonationPage);
 
function restartGame() {
    // Hide the game over screen
    gameOverScreen.style.display = 'none';

    // Reset everything
    startGame();
    
    // Optionally, disable restart button to prevent double clicks
    restartButton.disabled = true;
    
    // Re-enable restart button after short delay
    setTimeout(() => {
        restartButton.disabled = false;
    }, 1000); // 1 second delay
}

// Game logic functions
function startGame() {
    // Reset game state
    score = 0;
    isJumping = false;
    isGameOver = false;
    gameSpeed = INITIAL_GAME_SPEED;
    speedMultiplier = 1;
    level = 1;
    
    // Update displays
    scoreDisplay.textContent = '0';
    speedDisplay.textContent = '1';
    levelDisplay.textContent = '1';
    
    // Reset character position
    character.style.bottom = GROUND_LEVEL + 'px';
    
    // Clear existing obstacles and clouds
    document.querySelectorAll('.obstacle').forEach(obstacle => obstacle.remove());
    document.querySelectorAll('.cloud').forEach(cloud => cloud.remove());
    
    // Hide game over screen
    gameOverScreen.style.display = 'none';
    
    // Start game loops
    gameInterval = setInterval(updateGame, 20);
    updateObstacleInterval(INITIAL_OBSTACLE_INTERVAL);
    cloudInterval = setInterval(createCloud, 3000);
    scoreInterval = setInterval(updateScore, 100);
    speedIncreaseInterval = setInterval(increaseSpeed, SPEED_INCREASE_INTERVAL);
    
    // Disable start button
    startButton.disabled = true;
}

function updateGame() {
    // Move obstacles
    document.querySelectorAll('.obstacle').forEach(obstacle => {
        let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue('left'));
        
        if (obstacleLeft < -30) {
            obstacle.remove();
        } else {
            obstacle.style.left = (obstacleLeft - gameSpeed) + 'px';
            
            // Check for collision
            if (checkCollision(character, obstacle)) {
                endGame();
            }
        }
    });
    
    // Move clouds
    document.querySelectorAll('.cloud').forEach(cloud => {
        let cloudLeft = parseInt(window.getComputedStyle(cloud).getPropertyValue('left'));
        
        if (cloudLeft < -60) {
            cloud.remove();
        } else {
            cloud.style.left = (cloudLeft - (gameSpeed / 2)) + 'px';
        }
    });
}

function updateObstacleInterval(baseInterval) {
    // Clear existing interval
    if (obstacleInterval) {
        clearInterval(obstacleInterval);
    }
    
    // Create new interval adjusted for speed
    const adjustedInterval = baseInterval / speedMultiplier;
    obstacleInterval = setInterval(createObstacle, adjustedInterval);
}

function createObstacle() {
    if (isGameOver) return;
    
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    
    // Randomize obstacle height
    const height = Math.floor(Math.random() * 20) + 30;
    obstacle.style.height = height + 'px';
    
    gameContainer.appendChild(obstacle);
}

function createCloud() {
    if (isGameOver) return;
    
    const cloud = document.createElement('div');
    cloud.classList.add('cloud');
    
    // Randomize cloud position
    const top = Math.floor(Math.random() * 100) + 50;
    cloud.style.top = top + 'px';
    cloud.style.right = '-60px';
    
    gameContainer.appendChild(cloud);
}

function jump() {
    if (isJumping || isGameOver) return;
    
    isJumping = true;
    
    // Animation timeline for jumping
    const jumpStartTime = Date.now();
    const jumpEndTime = jumpStartTime + JUMP_DURATION;
    
    function jumpAnimation() {
        const currentTime = Date.now();
        
        // Check if jump animation should end
        if (currentTime >= jumpEndTime) {
            character.style.bottom = GROUND_LEVEL + 'px';
            isJumping = false;
            return;
        }
        
        // Calculate progress of jump (0 to 1)
        const jumpProgress = (currentTime - jumpStartTime) / JUMP_DURATION;
        
        // Sine wave for smooth up and down motion (0 to 1 to 0)
        const jumpFactor = Math.sin(jumpProgress * Math.PI);
        
        // Apply position based on jump height and factor
        const newPosition = GROUND_LEVEL + (JUMP_HEIGHT * jumpFactor);
        character.style.bottom = newPosition + 'px';
        
        // Continue animation
        requestAnimationFrame(jumpAnimation);
    }
    
    // Start jump animation
    requestAnimationFrame(jumpAnimation);
}

function handleKeyDown(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        jump();
    }
}

function updateScore() {
    if (isGameOver) return;
    
    score++;
    scoreDisplay.textContent = score;
    
    // Check if level should increase
    const newLevel = Math.floor(score / LEVEL_THRESHOLD) + 1;
    if (newLevel > level) {
        level = newLevel;
        levelDisplay.textContent = level;
        
        // Increase speed more significantly at level boundaries
        gameSpeed += 0.5;
        updateObstacleInterval(INITIAL_OBSTACLE_INTERVAL);
    }
}

function increaseSpeed() {
    if (isGameOver) return;
    
    // Increase speed gradually
    gameSpeed += SPEED_INCREASE_AMOUNT;
    speedMultiplier += 0.1;
    
    // Update speed display (rounded to 1 decimal place)
    speedDisplay.textContent = speedMultiplier.toFixed(1);
    
    // Update obstacle spawn rate based on new speed
    updateObstacleInterval(INITIAL_OBSTACLE_INTERVAL);
}

function checkCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

function endGame() {
    isGameOver = true;

    // Clear all game intervals
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    clearInterval(cloudInterval);
    clearInterval(scoreInterval);
    clearInterval(speedIncreaseInterval);

    // 🛠️ Remove all clouds
    document.querySelectorAll('.cloud').forEach(cloud => cloud.remove());

    // 🛠️ Remove all obstacles
    document.querySelectorAll('.obstacle').forEach(obstacle => obstacle.remove());

    // Show game over screen
    finalScoreDisplay.textContent = score;
    finalLevelDisplay.textContent = level;
    gameOverScreen.style.display = 'flex';

    // Re-enable start button
    startButton.disabled = false;
}


function openDonationPage() {
    // Replace with your actual donation page URL
    alert("Thank you for playing! You would now be redirected to make a donation.");
    // window.location.href = "your-donation-page.html";
}

