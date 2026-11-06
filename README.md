# 🎮 Tic Tac Toe (Clean & Modern)

A clean, responsive, and beginner-friendly **Tic Tac Toe** web game built with pure **HTML5, CSS3, and JavaScript**.

---

## ✨ Features

- **👥 2 Players (Local PvP)**: Play head-to-head with a friend on the same screen.
- **🤖 vs Bot (PvE)**: Play against a smart AI opponent that can defend and attack!
- **📊 Live Scoreboard**: Tracks wins for Player X, Player O / Bot, and Ties across rounds.
- **🔔 Real-Time Turn Indicator**: Clearly highlights who moves next with dynamic status badges.
- **✨ Win Animation & Highlight**: Winning cells glow and pulse when a round is won.
- **📱 Fully Responsive Design**: Looks sharp and plays smoothly on desktops, tablets, and mobile phones.
- **🔄 Game Controls**:
  - **Play Again**: Quickly starts a new round while keeping score.
  - **Reset Scores**: Clears scores back to 0-0.

---

## 📁 Project Structure

```
TicTacToe/
├── index.html     # Semantic HTML markup and layout
├── style.css      # Modern dark-mode styling with CSS variables & animations
├── script.js     # Clean, well-commented vanilla JavaScript logic
└── README.md      # Project documentation
```

---

## 🚀 How to Run

No installations, build steps, or dependencies required!

1. **Option 1: Direct in Browser**
   - Double-click `index.html` or drag and drop it into any modern web browser (Chrome, Safari, Firefox, Edge).

2. **Option 2: VS Code Live Server**
   - Open the project folder in VS Code.
   - Right-click `index.html` and click **"Open with Live Server"**.

---

## 💡 What Beginners Can Learn From This Code

1. **HTML**: Semantic tags (`<header>`, `<main>`, `<section>`, `<footer>`), `data-*` attributes for grid coordinates, and accessibility roles (`aria-label`, `role="grid"`).
2. **CSS**: CSS Custom Properties (`:root`), Flexbox, CSS Grid (`repeat(3, 1fr)`), modern gradients, `@keyframes` animations, and responsive `clamp()` units.
3. **JavaScript**:
   - Clean state management (`boardState`, `currentPlayer`, `isGameActive`, `scores`).
   - Event listeners and DOM manipulation (`document.querySelectorAll`, `classList`).
   - Win/Tie algorithm matching against 8 combinations.
   - Simple AI decision-making (winning moves -> blocking moves -> center -> corners).
   - `setTimeout` for natural interaction delays.
