# 🎮 Tic Tac Toe

A clean, responsive, and beginner-friendly **Tic Tac Toe** web application designed to pair with the **Rock Paper Scissors** project with matching aesthetics, design tokens, light/dark mode support, and keyboard controls.

---

## ✨ Features

- 🌓 **Light & Dark Theme Toggle**: Seamless switch between light and dark modes with preference stored in `localStorage` (matching the Rock Paper Scissors theme button).
- 👥 **Game Modes**:
  - **vs Computer (AI)**: Play against a smart computer opponent with move delay for natural interaction.
  - **2 Players**: Play locally with a friend on the same screen.
- 📊 **3-Card Scoreboard**: Real-time win/tie tracker matching the Rock Paper Scissors layout (`YOU`, `TIES`, `COMPUTER`).
- 🔔 **Status Banner**: "Ready to Play!" banner indicating the active player and game outcomes.
- ⌨️ **Keyboard Shortcuts**:
  - Keys `1`–`9`: Instantly mark squares 1 through 9.
  - Key `R`: Reset current game round.
- 📱 **Clean & Human UI**:
  - Solid, accessible colors (no flashy AI neon gradients).
  - Modern typography using `Plus Jakarta Sans`.
  - Rounded cards, clean borders, and smooth transitions.

---

## 📁 File Structure

```
TicTacToe/
├── index.html     # Semantic HTML layout
├── style.css      # Design system with CSS variables for Light & Dark modes
├── script.js     # Clean, well-commented vanilla JavaScript logic
└── README.md      # Documentation
```

---

## 🚀 How to Run

1. Open `index.html` in any modern web browser, or use the VS Code **Live Server** extension.
2. Toggle between **Light** and **Dark** modes using the button in the top-right corner.
3. Play using mouse clicks or keyboard numbers `1`–`9`.
