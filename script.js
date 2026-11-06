/**
 * Tic Tac Toe - Clean & Beginner-Friendly
 * Matches the structure and features of the Rock Paper Scissors game:
 * - Light / Dark mode toggle with local storage persistence
 * - 2 Players & vs Computer modes
 * - 3-Card Scoreboard (You / Ties / Computer)
 * - "Ready to Play!" status banner
 * - Keyboard shortcuts (1-9 to place mark, R to reset)
 */

/* ==========================================================================
   1. DOM ELEMENTS
   ========================================================================== */
const cells = document.querySelectorAll(".cell");

// Theme Toggle
const themeToggleBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// Status Banner
const statusBanner = document.getElementById("statusBanner");
const statusHeadline = document.getElementById("statusHeadline");
const statusSubtext = document.getElementById("statusSubtext");

// Scoreboard Elements
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreTiesEl = document.getElementById("scoreTies");
const playerXLabel = document.getElementById("playerXLabel");
const playerOLabel = document.getElementById("playerOLabel");
const botIconBox = document.getElementById("botIconBox");

// Controls
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
let gameMode = "ai"; // Default to 'ai' (vs Computer) like RPS
let botTimeoutId = null;

const scores = {
    X: 0,
    O: 0,
    ties: 0
};

// All 8 winning rows, columns, and diagonals
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

/* ==========================================================================
   3. THEME MANAGEMENT (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
    // Check saved theme in localStorage or system preference
    const savedTheme = localStorage.getItem("tictactoe-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

    applyTheme(initialTheme);
}

function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeIcon.innerText = "☀️";
        themeToggleBtn.setAttribute("title", "Switch to light mode");
    } else {
        document.documentElement.removeAttribute("data-theme");
        themeIcon.innerText = "🌙";
        themeToggleBtn.setAttribute("title", "Switch to dark mode");
    }
    localStorage.setItem("tictactoe-theme", theme);
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    applyTheme(isDark ? "light" : "dark");
}

/* ==========================================================================
   4. CORE GAME LOGIC
   ========================================================================== */

/**
 * Handle player move on cell click
 */
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedIndex = parseInt(clickedCell.getAttribute("data-index"), 10);

    // If cell already marked or round is over, ignore
    if (boardState[clickedIndex] !== "" || !isGameActive) {
        return;
    }

    executeMove(clickedIndex, currentPlayer);

    // Check Win
    const winResult = checkWin(boardState, currentPlayer);
    if (winResult) {
        handleWin(currentPlayer, winResult.combo);
        return;
    }

    // Check Tie
    if (checkTie(boardState)) {
        handleTie();
        return;
    }

    // Switch turn
    switchTurn();

    // Trigger Computer Move if vs Computer mode
    if (gameMode === "ai" && currentPlayer === "O" && isGameActive) {
        isGameActive = false;
        statusHeadline.innerText = "Computer is thinking...";
        statusSubtext.innerText = "Please wait a moment...";

        botTimeoutId = setTimeout(() => {
            makeComputerMove();
        }, 450);
    }
}

/**
 * Marks a square with 'X' or 'O'
 */
function executeMove(index, player) {
    boardState[index] = player;
    const cell = cells[index];
    cell.innerText = player;
    cell.classList.add(player.toLowerCase());
    cell.disabled = true;
}

/**
 * Alternate turn between X and O
 */
function switchTurn() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurnBanner();
}

/**
 * Updates the status banner text for the active player
 */
function updateTurnBanner() {
    statusBanner.className = "status-banner";

    if (currentPlayer === "X") {
        statusHeadline.innerText = gameMode === "ai" ? "Your Turn (X)" : "Player X's Turn";
        statusSubtext.innerText = "Pick an open square to place your mark.";
    } else {
        statusHeadline.innerText = gameMode === "ai" ? "Computer's Turn (O)" : "Player O's Turn";
        statusSubtext.innerText = "Waiting for Player O's move...";
    }
}

/**
 * Checks for a win in the current board
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
 * Checks if all cells are filled
 */
function checkTie(board) {
    return board.every(cell => cell !== "");
}

/**
 * Handle game win
 */
function handleWin(winner, winningCombo) {
    isGameActive = false;

    // Highlight winning squares
    winningCombo.forEach(index => {
        cells[index].classList.add("winner");
    });

    // Update Score
    scores[winner] += 1;
    updateScoreDisplay();

    // Banner
    statusBanner.className = "status-banner winner";
    if (gameMode === "ai") {
        statusHeadline.innerText = winner === "X" ? "🎉 You Won!" : "🤖 Computer Won!";
    } else {
        statusHeadline.innerText = `🎉 Player ${winner} Won!`;
    }
    statusSubtext.innerText = "Click Reset Game to play another round.";
}

/**
 * Handle game tie
 */
function handleTie() {
    isGameActive = false;
    scores.ties += 1;
    updateScoreDisplay();

    statusBanner.className = "status-banner tie";
    statusHeadline.innerText = "🤝 It's a Draw!";
    statusSubtext.innerText = "Good game! Click Reset Game to try again.";
}

/**
 * Update scoreboard numbers
 */
function updateScoreDisplay() {
    scoreXEl.innerText = scores.X;
    scoreOEl.innerText = scores.O;
    scoreTiesEl.innerText = scores.ties;
}

/* ==========================================================================
   5. COMPUTER (AI) OPPONENT LOGIC
   ========================================================================== */
function makeComputerMove() {
    const emptyIndices = [];
    boardState.forEach((val, idx) => {
        if (val === "") emptyIndices.push(idx);
    });

    if (emptyIndices.length === 0) return;

    let chosenIndex = null;

    // 1. Can Computer ('O') win in 1 move? Take it!
    for (const idx of emptyIndices) {
        const testBoard = [...boardState];
        testBoard[idx] = "O";
        if (checkWin(testBoard, "O")) {
            chosenIndex = idx;
            break;
        }
    }

    // 2. Can Player ('X') win next move? Block them!
    if (chosenIndex === null) {
        for (const idx of emptyIndices) {
            const testBoard = [...boardState];
            testBoard[idx] = "X";
            if (checkWin(testBoard, "X")) {
                chosenIndex = idx;
                break;
            }
        }
    }

    // 3. Take center if available
    if (chosenIndex === null && boardState[4] === "") {
        chosenIndex = 4;
    }

    // 4. Take a corner
    if (chosenIndex === null) {
        const corners = [0, 2, 6, 8].filter(idx => boardState[idx] === "");
        if (corners.length > 0) {
            chosenIndex = corners[Math.floor(Math.random() * corners.length)];
        }
    }

    // 5. Fallback to any random open square
    if (chosenIndex === null) {
        chosenIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    executeMove(chosenIndex, "O");

    const winResult = checkWin(boardState, "O");
    if (winResult) {
        handleWin("O", winResult.combo);
        return;
    }

    if (checkTie(boardState)) {
        handleTie();
        return;
    }

    isGameActive = true;
    switchTurn();
}

/* ==========================================================================
   6. GAME CONTROLS & RESET
   ========================================================================== */

/**
 * Resets the 3x3 board for a new round without resetting scores
 */
function resetBoard() {
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

    statusBanner.className = "status-banner";
    statusHeadline.innerText = "Ready to Play!";
    statusSubtext.innerText = "Click any square below to start.";
}

/**
 * Resets both scores and board
 */
function resetAllScores() {
    scores.X = 0;
    scores.O = 0;
    scores.ties = 0;
    updateScoreDisplay();
    resetBoard();
}

/**
 * Switch game mode (2 Players vs Computer)
 */
function setGameMode(mode) {
    if (gameMode === mode) return;

    gameMode = mode;

    if (mode === "pvp") {
        modePvpBtn.classList.add("active");
        modeAiBtn.classList.remove("active");
        playerXLabel.innerText = "PLAYER X";
        playerOLabel.innerText = "PLAYER O";
        botIconBox.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
        `;
    } else {
        modeAiBtn.classList.add("active");
        modePvpBtn.classList.remove("active");
        playerXLabel.innerText = "YOU";
        playerOLabel.innerText = "COMPUTER";
        botIconBox.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19 11h-1V9a5 5 0 0 0-5-5V3a1 1 0 0 0-2 0v1a5 5 0 0 0-5 5v2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2zm-9-2a3 3 0 0 1 3-3 3 3 0 0 1 3 3v2h-6V9zm8 9H6v-4h12v4zm-8-3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
        `;
    }

    resetAllScores();
}

/* ==========================================================================
   7. KEYBOARD SHORTCUTS (Matches RPS footer)
   ========================================================================== */
window.addEventListener("keydown", (e) => {
    // Ignore key presses if user is focused on an input element
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    // Keys 1-9 correspond to cells 0-8
    const num = parseInt(e.key, 10);
    if (!isNaN(num) && num >= 1 && num <= 9) {
        const cellIndex = num - 1;
        if (boardState[cellIndex] === "" && isGameActive) {
            cells[cellIndex].click();
        }
    }

    // Key 'R' or 'r' resets the game
    if (e.key === "r" || e.key === "R") {
        resetBoard();
    }
});

/* ==========================================================================
   8. EVENT LISTENERS
   ========================================================================== */
cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

themeToggleBtn.addEventListener("click", toggleTheme);
restartBtn.addEventListener("click", resetBoard);
resetScoreBtn.addEventListener("click", resetAllScores);

modePvpBtn.addEventListener("click", () => setGameMode("pvp"));
modeAiBtn.addEventListener("click", () => setGameMode("ai"));

// Initialize Theme & Game on Load
initTheme();
resetBoard();
