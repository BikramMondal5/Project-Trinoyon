// Wait for DOM to be fully loaded
window.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const gameContainer = document.getElementById('game-container');
    const player = document.getElementById('player');
    const starsContainer = document.getElementById('stars');
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const livesElement = document.getElementById('lives');
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over');
    const levelCompleteScreen = document.getElementById('level-complete');
    const finalScoreElement = document.getElementById('final-score');
    
    // Buttons
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const nextLevelBtn = document.getElementById('next-level-btn');
    
    // Game state - slower version
    let gameRunning = false;
    let playerPosition = 275;
    let score = 0;
    let level = 1;
    let lives = 3;
    let lasers = [];
    let enemies = [];
    let enemyLasers = [];
    let explosions = [];
    let keys = {};
    let enemySpeed = 1; 
    let enemyShootingProbability = 0.01; 
    let lastTime = 0;
    let enemyDirection = 1;
    
    // Game settings - slowed down
    const playerSpeed = 7; 
    const laserSpeed = 7; 
    const enemyLaserSpeed = 4; 
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = gameContainer.offsetHeight;
    const playerWidth = 50;
    const enemyWidth = 40;
    const enemyHeight = 30;
    const enemyGap = 15;
    
    // Create starfield
    function createStars() {
        starsContainer.innerHTML = '';
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.opacity = Math.random();
            star.style.width = `${Math.random() * 3}px`;
            star.style.height = star.style.width;
            starsContainer.appendChild(star);
        }
    }
    
    // Create a row of enemies
    function createEnemies() {
        // Clear any existing enemies first
        for (const enemy of enemies) {
            if (enemy.element && enemy.element.parentNode) {
                enemy.element.parentNode.removeChild(enemy.element);
            }
        }
        
        enemies = [];
        const rows = Math.min(3 + Math.floor(level / 2), 5);
        const enemiesPerRow = 8;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < enemiesPerRow; col++) {
                const enemy = {
                    x: col * (enemyWidth + enemyGap) + 30,
                    y: row * (enemyHeight + enemyGap) + 50,
                    width: enemyWidth,
                    height: enemyHeight,
                    element: document.createElement('div')
                };
                
                enemy.element.classList.add('enemy');
                enemy.element.style.left = `${enemy.x}px`;
                enemy.element.style.top = `${enemy.y}px`;
                gameContainer.appendChild(enemy.element);
                enemies.push(enemy);
            }
        }
    }
    
    // Shoot laser from player
    function shootLaser() {
        if (!gameRunning) return;
        
        // Prevent spamming by checking if we're shooting too frequently
        const now = Date.now();
        if (player.lastShot && now - player.lastShot < 300) {
            return; // Don't allow shooting too frequently
        }
        player.lastShot = now;
        
        const laser = {
            x: playerPosition + playerWidth / 2 - 2,
            y: containerHeight - 60,
            width: 4,
            height: 15,
            element: document.createElement('div')
        };
        
        laser.element.classList.add('laser');
        laser.element.style.left = `${laser.x}px`;
        laser.element.style.top = `${laser.y}px`;
        gameContainer.appendChild(laser.element);
        lasers.push(laser);
    }
    
    // Enemy shoots laser
    function enemyShoot(enemy) {
        const laser = {
            x: enemy.x + enemy.width / 2 - 1.5,
            y: enemy.y + enemy.height,
            width: 3,
            height: 10,
            element: document.createElement('div')
        };
        
        laser.element.classList.add('enemy-laser');
        laser.element.style.left = `${laser.x}px`;
        laser.element.style.top = `${laser.y}px`;
        gameContainer.appendChild(laser.element);
        enemyLasers.push(laser);
    }
    
    // Create explosion
    function createExplosion(x, y) {
        const explosion = {
            x: x,
            y: y,
            element: document.createElement('div'),
            timeLeft: 0.5
        };
        
        explosion.element.classList.add('explosion');
        explosion.element.style.left = `${x}px`;
        explosion.element.style.top = `${y}px`;
        gameContainer.appendChild(explosion.element);
        explosions.push(explosion);
    }
    
    // Check collisions
    function checkCollisions() {
        // Check player lasers hitting enemies
        for (let i = lasers.length - 1; i >= 0; i--) {
            const laser = lasers[i];
            let hitDetected = false;
            
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                if (
                    laser.x < enemy.x + enemy.width &&
                    laser.x + laser.width > enemy.x &&
                    laser.y < enemy.y + enemy.height &&
                    laser.y + laser.height > enemy.y
                ) {
                    // Hit detected
                    createExplosion(enemy.x, enemy.y);
                    gameContainer.removeChild(enemy.element);
                    enemies.splice(j, 1);
                    
                    // Mark laser as hit so we remove it after the loop
                    hitDetected = true;
                    
                    score += 10 * level;
                    scoreElement.textContent = score;
                    
                    // Check if all enemies are defeated
                    if (enemies.length === 0) {
                        levelComplete();
                    }
                    break;
                }
            }
            
            // Remove the laser if it hit something
            if (hitDetected) {
                gameContainer.removeChild(laser.element);
                lasers.splice(i, 1);
            }
        }
        
        // Check enemy lasers hitting player
        for (let i = enemyLasers.length - 1; i >= 0; i--) {
            const laser = enemyLasers[i];
            if (
                laser.x < playerPosition + playerWidth &&
                laser.x + laser.width > playerPosition &&
                laser.y < containerHeight - 20 &&
                laser.y + laser.height > containerHeight - 60
            ) {
                // Player hit
                createExplosion(playerPosition + playerWidth / 2 - 20, containerHeight - 60);
                gameContainer.removeChild(laser.element);
                enemyLasers.splice(i, 1);
                
                lives--;
                livesElement.textContent = lives;
                
                if (lives <= 0) {
                    gameOver();
                }
            }
        }
        
        // Check enemies reaching bottom or hitting player
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (enemy.y + enemy.height >= containerHeight - 60) {
                gameOver();
                break;
            }
            
            // Check for direct collision with player
            if (
                enemy.x < playerPosition + playerWidth &&
                enemy.x + enemy.width > playerPosition &&
                enemy.y + enemy.height > containerHeight - 60
            ) {
                gameOver();
                break;
            }
        }
    }
    
    // Move game objects
    function moveObjects(deltaTime) {
        // Move player
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
            playerPosition = Math.max(0, playerPosition - playerSpeed);
        }
        if (keys['ArrowRight'] || keys['d'] || keys['D']) {
            playerPosition = Math.min(containerWidth - playerWidth, playerPosition + playerSpeed);
        }
        player.style.left = `${playerPosition}px`;
        
        // Move lasers
        for (let i = lasers.length - 1; i >= 0; i--) {
            const laser = lasers[i];
            laser.y -= laserSpeed;
            laser.element.style.top = `${laser.y}px`;
            
            // Remove lasers that go offscreen
            if (laser.y < 0) {
                if (laser.element && laser.element.parentNode) {
                    gameContainer.removeChild(laser.element);
                }
                lasers.splice(i, 1);
            }
        }
        
        // Move enemy lasers
        for (let i = enemyLasers.length - 1; i >= 0; i--) {
            const laser = enemyLasers[i];
            laser.y += enemyLaserSpeed;
            laser.element.style.top = `${laser.y}px`;
            
            // Remove lasers that go offscreen
            if (laser.y > containerHeight) {
                if (laser.element && laser.element.parentNode) {
                    gameContainer.removeChild(laser.element);
                }
                enemyLasers.splice(i, 1);
            }
        }
        
        // Move enemies
        let shouldStepDown = false;
        for (const enemy of enemies) {
            enemy.x += enemySpeed * enemyDirection;
            
            // Check if any enemy is at the edge
            if (
                (enemyDirection > 0 && enemy.x + enemy.width > containerWidth - 10) ||
                (enemyDirection < 0 && enemy.x < 10)
            ) {
                shouldStepDown = true;
            }
        }
        
        if (shouldStepDown) {
            enemyDirection *= -1;
            for (const enemy of enemies) {
                enemy.y += 20;
            }
        }
        
        // Update enemy positions
        for (const enemy of enemies) {
            enemy.element.style.left = `${enemy.x}px`;
            enemy.element.style.top = `${enemy.y}px`;
            
            // Random enemy shooting
            if (Math.random() < enemyShootingProbability * deltaTime) {
                enemyShoot(enemy);
            }
        }
        
        // Update explosions
        for (let i = explosions.length - 1; i >= 0; i--) {
            const explosion = explosions[i];
            explosion.timeLeft -= deltaTime;
            
            if (explosion.timeLeft <= 0) {
                if (explosion.element && explosion.element.parentNode) {
                    gameContainer.removeChild(explosion.element);
                }
                explosions.splice(i, 1);
            }
        }
    }
    
    // Game loop - with artificially slowed frame rate
    function gameLoop(timestamp) {
        if (!gameRunning) return;
        
        // Apply a slower time scale factor
        const timeScale = 1; 
        const deltaTime = Math.min((timestamp - lastTime) / 1000, 0.1) * timeScale; // Cap delta time to prevent issues
        lastTime = timestamp;
        
        moveObjects(deltaTime);
        checkCollisions();
        
        // Use setTimeout to artificially slow down the frame rate
        setTimeout(() => {
            requestAnimationFrame(gameLoop);
        }, 1); // Add a small delay between frames
    }
    
    // Level complete function
    function levelComplete() {
        gameRunning = false;
        level++;
        levelElement.textContent = level;
        
        // Remove all lasers
        for (const laser of lasers) {
            if (laser.element && laser.element.parentNode) {
                gameContainer.removeChild(laser.element);
            }
        }
        lasers = [];
        
        for (const laser of enemyLasers) {
            if (laser.element && laser.element.parentNode) {
                gameContainer.removeChild(laser.element);
            }
        }
        enemyLasers = [];
        
        // Show level complete screen
        levelCompleteScreen.style.display = 'flex';
        
        // Increase difficulty (more gentle progression)
        enemySpeed += 0.2; 
        enemyShootingProbability += 0.002; 
    }
    
    // Game over function
    function gameOver() {
        gameRunning = false;
        finalScoreElement.textContent = score;
        gameOverScreen.style.display = 'flex';
    }
    
    // Clean up game objects
    function cleanupGameObjects() {
        // Remove all game objects
        for (const laser of lasers) {
            if (laser.element && laser.element.parentNode) {
                laser.element.parentNode.removeChild(laser.element);
            }
        }
        
        for (const laser of enemyLasers) {
            if (laser.element && laser.element.parentNode) {
                laser.element.parentNode.removeChild(laser.element);
            }
        }
        
        for (const enemy of enemies) {
            if (enemy.element && enemy.element.parentNode) {
                enemy.element.parentNode.removeChild(enemy.element);
            }
        }
        
        for (const explosion of explosions) {
            if (explosion.element && explosion.element.parentNode) {
                explosion.element.parentNode.removeChild(explosion.element);
            }
        }
        
        lasers = [];
        enemyLasers = [];
        enemies = [];
        explosions = [];
    }
    
    // Start new game
    function startGame() {
        // Reset game state
        score = 0;
        level = 1;
        lives = 3;
        enemySpeed = 1; 
        enemyShootingProbability = 0.01; 
        playerPosition = 275;
        
        // Update UI
        scoreElement.textContent = score;
        levelElement.textContent = level;
        livesElement.textContent = lives;
        
        // Clean up any existing game objects
        cleanupGameObjects();
        
        // Reset player position
        player.style.left = `${playerPosition}px`;
        
        // Create enemies
        createEnemies();
        
        // Hide screens
        startScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
        levelCompleteScreen.style.display = 'none';
        
        // Start game loop
        gameRunning = true;
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
    
    // Start next level
    function startNextLevel() {
        levelCompleteScreen.style.display = 'none';
        createEnemies();
        gameRunning = true;
        lastTime = performance.now();
        requestAnimationFrame(gameLoop);
    }
    
    // Event listeners
    document.addEventListener('keydown', function(e) {
        keys[e.key] = true;
        
        // Space bar to shoot
        if (e.key === ' ' && gameRunning) {
            shootLaser();
            e.preventDefault(); // Prevent page scrolling
        }
    });
    
    document.addEventListener('keyup', function(e) {
        keys[e.key] = false;
    });
    
    // Button event listeners
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    nextLevelBtn.addEventListener('click', startNextLevel);
    
    // Initialize stars
    createStars();
});