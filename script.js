document.addEventListener("DOMContentLoaded", () => {
  const gameCells = document.querySelectorAll(".cell");
  const playerStatus = document.getElementById("player-status");
  const resetButton = document.getElementById("reset-btn");
  const nextRoundButton = document.getElementById("next-round-btn");
  const mainTitle = document.querySelector("h1");
  const boardContainer = document.querySelector(".btns-grid");

  let userScore = 0;
  let computerScore = 0;
  const userScoreDisplay = document.getElementById("user-score");
  const computerScoreDisplay = document.getElementById("computer-score");

  let currentPlayer = "user";
  let isGameActive = true;
  let isComputerThinking = false;
  let board = Array(9).fill("");

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function getSymbol(player) {
    return player === "user" ? "X" : "O";
  }

  function isBoardFull() {
    return !board.includes("");
  }

  function updatePlayerStatus() {
    playerStatus.textContent = `Player Status: ${
      currentPlayer === "user" ? "Your turn!" : "Computer's turn."
    }`;
    nextRoundButton.disabled = isGameActive;
  }

  function markCell(index, player) {
    const symbol = getSymbol(player);
    board[index] = symbol;
    const cell = gameCells[index];
    cell.textContent = symbol;
    cell.classList.add(player === "user" ? "x" : "o");
  }

  function checkWinner() {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        [a, b, c].forEach((i) => gameCells[i].classList.add("winner"));
        endGame(board[a] === "X" ? "user" : "computer");
        return true;
      }
    }

    if (isBoardFull()) {
      endGame("tie");
      return true;
    }

    return false;
  }

  function endGame(winner) {
    isGameActive = false;
    boardContainer.classList.add("board-blur");

    if (winner === "user") {
      mainTitle.textContent = "You win!";
      userScore++;
      userScoreDisplay.textContent = `Your Score: ${userScore}`;
    } else if (winner === "computer") {
      mainTitle.textContent = "Computer wins!";
      computerScore++;
      computerScoreDisplay.textContent = `Computer Score: ${computerScore}`;
    } else {
      mainTitle.textContent = "It's a tie!";
    }

    updatePlayerStatus();
  }

  function handleUserMove(index) {
    if (
      !isGameActive ||
      isComputerThinking ||
      board[index] !== "" ||
      currentPlayer !== "user"
    )
      return;

    markCell(index, "user");
    if (checkWinner()) return;

    currentPlayer = "computer";
    updatePlayerStatus();
    isComputerThinking = true;

    setTimeout(() => {
      handleComputerMove();
      isComputerThinking = false;
    }, 500);
  }

  function handleComputerMove() {
    if (!isGameActive) return;

    const move = findBestMove();
    markCell(move, "computer");
    if (checkWinner()) return;

    currentPlayer = "user";
    updatePlayerStatus();
  }

  function findBestMove() {
    for (let combo of winningCombos) {
      const move = checkCombo(combo, "O");
      if (move !== null) return move;
    }

    for (let combo of winningCombos) {
      const move = checkCombo(combo, "X");
      if (move !== null) return move;
    }

    const available = board
      .map((v, i) => (v === "" ? i : null))
      .filter((i) => i !== null);
    return available[Math.floor(Math.random() * available.length)];
  }

  function checkCombo(combo, symbol) {
    const [a, b, c] = combo;
    const values = [board[a], board[b], board[c]];
    if (
      values.filter((v) => v === symbol).length === 2 &&
      values.includes("")
    ) {
      return combo[values.indexOf("")];
    }
    return null;
  }

  function resetBoard() {
    board = Array(9).fill("");
    gameCells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("x", "o", "winner");
    });
    boardContainer.classList.remove("board-blur");
    currentPlayer = "user";
    isGameActive = true;
    isComputerThinking = false;
    mainTitle.textContent = "X & O's vs Computer";
    updatePlayerStatus();
  }

  function resetGame() {
    userScore = 0;
    computerScore = 0;
    userScoreDisplay.textContent = `Your Score: ${userScore}`;
    computerScoreDisplay.textContent = `Computer Score: ${computerScore}`;
    resetBoard();
    console.log("resetGame() called — scores reset to 0");
  }

  gameCells.forEach((cell, i) =>
    cell.addEventListener("click", () => handleUserMove(i))
  );
  resetButton.onclick = resetGame;
  nextRoundButton.onclick = resetBoard;

  updatePlayerStatus();
});
