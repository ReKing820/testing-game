// Variables del juego
let board = [];
let revealed = [];
let score = 0;
let level = 1;
let gameOver = false;
const BOARD_SIZE = 5;
const WINNING_SCORE = 50;

// Elementos del DOM
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const messageElement = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');
const cards = document.querySelectorAll('.card');
const colHeaders = document.querySelectorAll('.col-header');
const rowHeaders = document.querySelectorAll('.row-header');

// Inicializar el juego
function initGame() {
    board = [];
    revealed = [];
    score = 0;
    gameOver = false;
    
    // Actualizar UI
    scoreElement.textContent = '0';
    levelElement.textContent = '1';
    messageElement.textContent = '';
    messageElement.className = 'message';
    restartBtn.classList.add('hidden');
    
    // Generar tablero
    generateBoard();
    
    // Resetear cartas
    cards.forEach(card => {
        card.className = 'card';
        card.textContent = '?';
    });
    
    // Actualizar headers
    updateHeaders();
}

// Generar tablero con Voltorbs y puntos
function generateBoard() {
    // Crear tablero vacío
    for (let i = 0; i < BOARD_SIZE; i++) {
        board[i] = [];
        revealed[i] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = 1; // Empezar con 1s
            revealed[i][j] = false;
        }
    }
    
    // Número de Voltorbs basado en el nivel (3-6 Voltorbs)
    const numVoltorbs = Math.min(3 + level, 6);
    let placedVoltorbs = 0;
    
    // Colocar Voltorbs aleatoriamente
    while (placedVoltorbs < numVoltorbs) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);
        
        if (board[row][col] !== 0) {
            board[row][col] = 0; // 0 representa Voltorb
            placedVoltorbs++;
        }
    }
    
    // Mejorar algunos valores (cambiar algunos 1s por 2s y 3s)
    const numUpgrades = 8 + level * 2;
    let upgrades = 0;
    
    while (upgrades < numUpgrades) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);
        
        if (board[row][col] > 0) {
            // Probabilidad: 70% para 2, 30% para 3
            if (Math.random() < 0.7) {
                board[row][col] = 2;
            } else {
                board[row][col] = 3;
            }
            upgrades++;
        }
    }
}

// Actualizar los headers con las pistas
function updateHeaders() {
    for (let col = 0; col < BOARD_SIZE; col++) {
        let colSum = 0;
        let colVoltorbs = 0;
        
        for (let row = 0; row < BOARD_SIZE; row++) {
            if (board[row][col] === 0) {
                colVoltorbs++;
            } else {
                colSum += board[row][col];
            }
        }
        
        colHeaders[col].textContent = `${colSum}⚡${colVoltorbs}`;
    }
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        let rowSum = 0;
        let rowVoltorbs = 0;
        
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === 0) {
                rowVoltorbs++;
            } else {
                rowSum += board[row][col];
            }
        }
        
        rowHeaders[row].textContent = `${rowSum}⚡${rowVoltorbs}`;
    }
}

// Manejar click en carta
function handleCardClick(e) {
    if (gameOver) return;
    
    const card = e.target;
    const row = parseInt(card.dataset.row);
    const col = parseInt(card.dataset.col);
    
    if (revealed[row][col]) return;
    
    revealed[row][col] = true;
    card.classList.add('revealed');
    
    const value = board[row][col];
    
    if (value === 0) {
        // Es un Voltorb - Game Over
        card.classList.add('voltorb');
        card.textContent = '⚡';
        endGame(false);
    } else {
        // Es un punto
        card.classList.add('safe');
        card.textContent = value;
        score += value;
        scoreElement.textContent = score;
        
        // Verificar victoria
        if (score >= WINNING_SCORE) {
            endGame(true);
        }
    }
}

// Fin del juego
function endGame(won) {
    gameOver = true;
    
    if (won) {
        messageElement.textContent = `¡Felicidades! Ganaste con ${score} puntos`;
        messageElement.classList.add('win');
        level++;
    } else {
        messageElement.textContent = '¡BOOM! Encontraste un Voltorb';
        messageElement.classList.add('lose');
        
        // Revelar todos los Voltorbs
        cards.forEach(card => {
            const row = parseInt(card.dataset.row);
            const col = parseInt(card.dataset.col);
            
            if (board[row][col] === 0 && !revealed[row][col]) {
                card.classList.add('revealed', 'voltorb');
                card.textContent = '⚡';
            }
        });
    }
    
    restartBtn.classList.remove('hidden');
}

// Event listeners
cards.forEach(card => {
    card.addEventListener('click', handleCardClick);
});

restartBtn.addEventListener('click', () => {
    if (gameOver && score >= WINNING_SCORE) {
        // Si ganó, continuar al siguiente nivel
        levelElement.textContent = level;
        messageElement.textContent = '';
        messageElement.className = 'message';
        restartBtn.classList.add('hidden');
        
        // Resetear tablero pero mantener score y nivel
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                revealed[i][j] = false;
            }
        }
        
        generateBoard();
        
        cards.forEach(card => {
            card.className = 'card';
            card.textContent = '?';
        });
        
        updateHeaders();
        gameOver = false;
    } else {
        // Reiniciar juego completo
        level = 1;
        initGame();
    }
});

// Iniciar el juego al cargar
initGame();
