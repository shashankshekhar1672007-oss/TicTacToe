/**
 * Tic Tac Toe - Beginner-Friendly Game Logic
 * 
 * Features:
 * - 2-Player (PvP) and vs Bot (PvE) modes
 * - Real-time turn indicator
 * - Live score tracker for Player X, Player O, and Ties
 * - Winning pattern highlight animation
 * - Quick game restart and score reset
 */

/* ==========================================================================
   1. DOM ELEMENTS
   ========================================================================== */
const cells = document.querySelectorAll(".cell");
const statusBadge = document.getElementById("statusBadge");
const turnIcon = document.getElementById("turnIcon");
const statusText = document.getElementById("statusText");

const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreTiesEl = document.getElementById("scoreTies");
const playerOLabel = document.getElementById("playerOLabel");

const restartBtn = document.getElementById("restartBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const modePvpBtn = document.getElementById("modePvp");
const modeAiBtn = document.getElementById("modeAi");

/* ==========================================================================
   2. GAME STATE
   ========================================================================== */
let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let gameMode = "pvp"; // "pvp" (2 Players) or "ai" (vs Bot)
let botTimeoutId = null; // Keeps track of pending bot moves to prevent race conditions

const scores = {
    X: 0,
    O: 0,
    ties: 0
};

// All 8 possible winning line index combinations (3 rows, 3 columns, 2 diagonals)
const WINNING_COMBINATIONS = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left
    [2, 4, 6]  // Diagonal from top-right
];

/* ==========================================================================
   3. CORE GAME FUNCTIONS
   ========================================================================== */

/**
 * Handle a user clicking on any cell in the grid
 */
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedIndex = parseInt(clickedCell.getAttribute("data-index"), 10);

    // If the cell is already occupied or the game has ended, ignore the click
    if (boardState[clickedIndex] !== "" || !isGameActive) {
        return;
    }

    // Play the move for current player
    makeMove(clickedIndex, currentPlayer);

    // Check if this move produced a win or a tie
    const winningData = checkWin(boardState, currentPlayer);

    if (winningData) {
        handleGameWin(currentPlayer, winningData.combo);
        return;
    }

    if (checkTie(boardState)) {
        handleGameTie();
        return;
    }

    // Switch turns
    switchTurn();

    // If playing against Bot and it's Bot's turn (O), trigger AI move
    if (gameMode === "ai" && currentPlayer === "O" && isGameActive) {
        // Temporarily pause player input while bot "thinks"
        isGameActive = false;
        statusText.innerText = "Bot is thinking...";
        
        botTimeoutId = setTimeout(() => {
            makeBotMove();
        }, 400); // 400ms delay gives a natural, pleasant feel
    }
}

/**
 * Place a mark ('X' or 'O') on the board at a specific index
 */
function makeMove(index, player) {
    boardState[index] = player;
    const cell = cells[index];
    cell.innerText = player;
    cell.classList.add(player.toLowerCase());
    cell.disabled = true;
}

/**
 * Switch the active turn between 'X' and 'O'
 */
function switchTurn() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatusTurn();
}

/**
 * Update the turn status badge in the UI
 */
function updateStatusTurn() {
    statusBadge.className = "status-badge";
    
    if (currentPlayer === "X") {
        statusBadge.classList.add("turn-x");
        turnIcon.innerText = "X";
        statusText.innerText = "Player X's Turn";
    } else {
        statusBadge.classList.add("turn-o");
        turnIcon.innerText = "O";
        statusText.innerText = gameMode === "ai" ? "Bot (O)'s Turn" : "Player O's Turn";
    }
}

/**
 * Check if the specified player has achieved any winning combination
 */
function checkWin(board, player) {
    for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return { winner: player, combo: combo };
        }
    }
    return null;
}

/**
 * Check if the board is full with no winner (Tie)
 */
function checkTie(board) {
    return board.every(cell => cell !== "");
}

/**
 * Handle game win event: update score, highlight cells, display message
 */
function handleGameWin(winner, winningCombo) {
    isGameActive = false;

    // Highlight winning cells
    winningCombo.forEach(index => {
        cells[index].classList.add("winner");
    });

    // Update score
    scores[winner] += 1;
    updateScoreboard();

    // Update status UI
    statusBadge.className = "status-badge winner";
    turnIcon.innerText = "🎉";
    
    if (gameMode === "ai") {
        statusText.innerText = winner === "X" ? "You Won!" : "Bot Won!";
    } else {
        statusText.innerText = `Player ${winner} Wins!`;
    }
}

/**
 * Handle game tie event
 */
function handleGameTie() {
    isGameActive = false;
    scores.ties += 1;
    updateScoreboard();

    statusBadge.className = "status-badge tie";
    turnIcon.innerText = "🤝";
    statusText.innerText = "It's a Draw!";
}

/**
 * Update the scoreboard numbers
 */
function updateScoreboard() {
    scoreXEl.innerText = scores.X;
    scoreOEl.innerText = scores.O;
    scoreTiesEl.innerText = scores.ties;
}

/* ==========================================================================
   4. SMART BOT (AI) LOGIC
   ========================================================================== */

/**
 * Computes and executes the bot's move
 * Simple priority order:
 * 1. Can Bot win this turn? If so, take it!
 * 2. Can Player win next turn? If so, block them!
 * 3. Take center tile if available.
 * 4. Take a corner tile if available.
 * 5. Take any remaining empty tile.
 */
function makeBotMove() {
    const emptyIndices = [];
    boardState.forEach((val, idx) => {
        if (val === "") emptyIndices.push(idx);
    });

    if (emptyIndices.length === 0) return;

    let chosenIndex = null;

    // 1. Check if Bot ('O') can win immediately
    for (const idx of emptyIndices) {
        const boardCopy = [...boardState];
        boardCopy[idx] = "O";
        if (checkWin(boardCopy, "O")) {
            chosenIndex = idx;
            break;
        }
    }

    // 2. Check if Player ('X') can win, and block
    if (chosenIndex === null) {
        for (const idx of emptyIndices) {
            const boardCopy = [...boardState];
            boardCopy[idx] = "X";
            if (checkWin(boardCopy, "X")) {
                chosenIndex = idx;
                break;
            }
        }
    }

    // 3. Take the center (index 4) if open
    if (chosenIndex === null && boardState[4] === "") {
        chosenIndex = 4;
    }

    // 4. Take an open corner (0, 2, 6, 8)
    if (chosenIndex === null) {
        const corners = [0, 2, 6, 8].filter(idx => boardState[idx] === "");
        if (corners.length > 0) {
            chosenIndex = corners[Math.floor(Math.random() * corners.length)];
        }
    }

    // 5. Fallback: random remaining cell
    if (chosenIndex === null) {
        chosenIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    // Execute the bot's chosen move
    makeMove(chosenIndex, "O");

    // Check if bot won or tied
    const winningData = checkWin(boardState, "O");

    if (winningData) {
        handleGameWin("O", winningData.combo);
        return;
    }

    if (checkTie(boardState)) {
        handleGameTie();
        return;
    }

    // Switch turn back to human player (X)
    isGameActive = true;
    switchTurn();
}

/* ==========================================================================
   5. GAME RESET & CONTROLS
   ========================================================================== */

/**
 * Reset the board to start a fresh round without clearing the score
 */
function restartRound() {
    if (botTimeoutId) {
        clearTimeout(botTimeoutId);
        botTimeoutId = null;
    }

    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;

    cells.forEach(cell => {
        cell.innerText = "";
        cell.className = "cell";
        cell.disabled = false;
    });

    updateStatusTurn();
}

/**
 * Reset all scores back to zero and restart the board
 */
function resetAllScores() {
    scores.X = 0;
    scores.O = 0;
    scores.ties = 0;
    updateScoreboard();
    restartRound();
}

/**
 * Switch game mode between 'pvp' and 'ai'
 */
function setGameMode(mode) {
    if (gameMode === mode) return;

    gameMode = mode;

    if (mode === "pvp") {
        modePvpBtn.classList.add("active");
        modeAiBtn.classList.remove("active");
        playerOLabel.innerText = "Player (O)";
    } else {
        modeAiBtn.classList.add("active");
        modePvpBtn.classList.remove("active");
        playerOLabel.innerText = "Bot (O)";
    }

    // Reset scores & board on mode switch for a fair match
    resetAllScores();
}

/* ==========================================================================
   6. EVENT LISTENERS
   ========================================================================== */
cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

restartBtn.addEventListener("click", restartRound);
resetScoreBtn.addEventListener("click", resetAllScores);

modePvpBtn.addEventListener("click", () => setGameMode("pvp"));
modeAiBtn.addEventListener("click", () => setGameMode("ai"));

// Initialize turn display on page load
updateStatusTurn();
