const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const endgameElement = document.getElementById('endgame');
const endgameMessageElement = document.getElementById('endgameMessage');
const newGameButton = document.getElementById('newGameButton');
const nextLevelButton = document.getElementById('nextLevelButton');
const levelDisplay = document.getElementById('level');
const livesDisplay = document.getElementById('lives');
const prizesDisplay = document.getElementById('prizes');

const X_CLASS = 'x';
const O_CLASS = 'o';
let circleTurn;
let level = 1;
let lives = 3;
let continuousWins = 0;
let prizes = [];
const PRIZE_THRESHOLD = 3; // Number of wins needed to earn a prize

let WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const COLORS = ['#ff6f61', '#61a0ff', '#ffd700', '#98fb98', '#f08080'];

startGame();

newGameButton.addEventListener('click', startGame);
nextLevelButton.addEventListener('click', nextLevel);

function startGame() {
    circleTurn = false;
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    endgameElement.style.display = 'none';
    board.style.display = 'grid';
    nextLevelButton.style.display = 'none';
    if (level >= 3) {
        randomizeCellPositions(); // Add difficulty from level 3
    }
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (level >= 3) {
            randomizeCellPositions(); // Shuffle after every turn
        }
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function endGame(draw) {
    if (draw) {
        endgameMessageElement.innerText = 'It\'s a Draw!';
        loseLife();
    } else {
        endgameMessageElement.innerText = `${circleTurn ? "O" : "X"} Wins!`;
        continuousWins++;
        gainLife();
        checkPrize();
        nextLevelButton.style.display = 'block';
    }
    board.style.display = 'none';
    endgameElement.style.display = 'flex';
}

function nextLevel() {
    level++;
    levelDisplay.innerText = level;
    randomizeWinningCombinations();
    changeBackgroundColor();
    startGame();
}

function randomizeWinningCombinations() {
    WINNING_COMBINATIONS = WINNING_COMBINATIONS.sort(() => Math.random() - 0.5);
}

function changeBackgroundColor() {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    document.body.style.backgroundColor = randomColor;
}

function gainLife() {
    lives++;
    livesDisplay.innerText = lives;
}

function loseLife() {
    lives--;
    livesDisplay.innerText = lives;
    if (lives <= 0) {
        endGameWithNoLives();
    }
}

function endGameWithNoLives() {
    endgameMessageElement.innerText = 'Game Over! You\'ve lost all lives.';
    board.style.display = 'none';
    nextLevelButton.style.display = 'none';
    endgameElement.style.display = 'flex';
}

function checkPrize() {
    if (continuousWins % PRIZE_THRESHOLD === 0) {
        const prize = `Prize ${prizes.length + 1}`;
        prizes.push(prize);
        prizesDisplay.innerText = prizes.join(', ');
    }
}

function randomizeCellPositions() {
    const shuffledCells = Array.from(cells).sort(() => Math.random() - 0.5); // Shuffle the cells
    shuffledCells.forEach(cell => {
        board.appendChild(cell); // Rearrange them on the board
    });
}

const availableSkins = {
    X: ['x-default', 'x-futuristic', 'x-nature'],
    O: ['o-default', 'o-futuristic', 'o-nature'],
};
let currentSkin = { X: 'x-default', O: 'o-default' };

// Function to update skins
function setSkin(xSkin, oSkin) {
    currentSkin.X = xSkin;
    currentSkin.O = oSkin;
    cells.forEach(cell => {
        cell.classList.remove('x-default', 'x-futuristic', 'x-nature', 'o-default', 'o-futuristic', 'o-nature');
    });
}

const achievements = {
    firstWin: false,
    win3InARow: false,
    noLifeLostWin: false
};

// Function to check for achievements
function checkAchievements() {
    if (!achievements.firstWin && continuousWins === 1) {
        achievements.firstWin = true;
        alert('Achievement Unlocked: First Win!');
    }
    if (!achievements.win3InARow && continuousWins === 3) {
        achievements.win3InARow = true;
        alert('Achievement Unlocked: 3 Wins in a Row!');
    }
    if (!achievements.noLifeLostWin && lives === 3 && continuousWins > 3) {
        achievements.noLifeLostWin = true;
        alert('Achievement Unlocked: Perfect Wins!');
    }
}

let availablePowerUps = {
    hint: 1,  // One hint available
    undo: 1   // One undo available
};

function useHint() {
    if (availablePowerUps.hint > 0) {
        const bestMove = getBestMove();  // Create your logic to get the best move
        highlightCell(bestMove);
        availablePowerUps.hint--;
    } else {
        alert('No more hints available');
    }
}

function undoMove() {
    if (availablePowerUps.undo > 0) {
        undoLastMove();  // Add logic to undo the last move
        availablePowerUps.undo--;
    } else {
        alert('No more undos available');
    }
}

function adjustBoardSize() {
    if (level >= 4) {
        board.style.gridTemplateColumns = 'repeat(4, 1fr)';
        // Add logic to handle 4x4 grid
    } else {
        board.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }
}


